// vite-plugin-entity-processes.ts
export function entityProcessesPlugin() {
	return {
		name: 'entity-processes',
		transform(code: string, id: string) {
			// Nur src/core/entities.ts bearbeiten
			if (!id.endsWith('src/core/entities.ts')) {
				return null;
			}

			let modifiedCode = code;

			// Finde die compile() Schleife
			const compileLoopRegex = /for\s*\(.*?\)\s*{[^}]*entity\.compile\(\);/s;

			if (compileLoopRegex.test(modifiedCode)) {
				modifiedCode = modifiedCode.replace(
					compileLoopRegex,
					(match) => {
						return match.replace(
							'entity.compile();',
							`// === ENTITY PROZESSE LADEN ===
              
              // 1. DATABASE PROZESSE
              // Lade alle DB Prozesse aus allen Entity-Ordnern
              const dbProcesses = import.meta.glob('../entities/*/db/*Process.ts', { eager: true });
              const relevantDbProcesses = {};
              
              // Definiere welche DB Prozess-Typen wir suchen
              const dbProcessTypes = [
                'fromProcess',
                'conditionProcess',
                'orderProcess'
              ];
              
              // Filtere nur die Prozesse für diese spezifische Entity
              Object.entries(dbProcesses).forEach(([path, module]) => {
                // Prüfe ob der Pfad zu dieser Entity gehört
                if (path.includes(\`/\${entityName}_entity/db/\`)) {
                  relevantDbProcesses[path] = module;
                  
                  // Weise jeden gefundenen Prozess-Typ zu
                  dbProcessTypes.forEach(processType => {
                    if (path.endsWith(\`\${processType}.ts\`) && module[processType]) {
                      entity.db[processType] = module[processType];
                    }
                  });
                }
              });
              
              // 2. FIELD PROZESSE
              // Lade alle Field Prozesse aus allen Entity-Ordnern
              const fieldProcesses = import.meta.glob('../entities/*/fields/*/*Process.ts', { eager: true });
              
              // Definiere welche Field Prozess-Typen wir suchen
              const fieldProcessTypes = [
                'valueProcess',           // Berechnet den Wert
                'displayValueProcess',    // Formatiert die Anzeige
                'onValueChangedProcess',  // Reagiert auf Wertänderungen
                'onValidationProcess',    // Validiert Eingaben
                'onStateProcess',         // Bestimmt den Feld-Status
                'titleProcess',           // Dynamischer Titel
                'colorProcess',            // Dynamische Farbe
				'dropdownProcess'
              ];
              
              // Gehe durch alle Fields dieser Entity
              Object.entries(entity.fields).forEach(([fieldName, fieldDef]) => {
                // Suche nach Prozessen für dieses spezifische Field
                Object.entries(fieldProcesses).forEach(([path, module]) => {
                  // Prüfe ob der Pfad zu dieser Entity und diesem Field gehört
                  if (path.includes(\`/\${entityName}_entity/fields/\${fieldName}/\`)) {
                    // Weise jeden gefundenen Prozess-Typ zu
                    fieldProcessTypes.forEach(processType => {
                      if (path.endsWith(\`\${processType}.ts\`) && module[processType]) {
                        fieldDef[processType] = module[processType];
                      }
                    });
                  }
                });
              });
              
              // Rufe compile mit den DB Prozessen auf
              entity.compile({ processes: relevantDbProcesses });`
						);
					}
				);
			}

			return {
				code: modifiedCode,
				map: null
			};
		}
	};
}
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

export function autoLoadEntitiesPlugin() {
	return {
		name: 'auto-load-entities',
		enforce: 'pre',
		transform(code: string, id: string) {
			if (!id.endsWith('src/core/entities.ts')) {
				return null;
			}

			const entitiesDir = join(process.cwd(), 'src/entities');
			const entityFolders = readdirSync(entitiesDir)
				.filter(dir => dir.endsWith('_entity'))
				.filter(dir => existsSync(join(entitiesDir, dir, `${dir}.ts`)));

			// Finde bereits vorhandene imports
			const existingImports = new Set();
			const importRegex = /import\s+(\w+)\s+from\s+['"].*?\/entities\/(\w+)\/\2['"]/g;
			let match;
			while ((match = importRegex.exec(code)) !== null) {
				existingImports.add(match[2]);
			}

			// Generiere nur neue imports
			const newEntities = entityFolders.filter(folder => !existingImports.has(folder));
			const newImports = newEntities
				.map(folder => `import ${folder} from '../entities/${folder}/${folder}';`)
				.join('\n');

			let modifiedCode = code;

			// Füge neue imports nach den bestehenden ein
			if (newImports) {
				const lastImportRegex = /(import[^;]+;)\s*\n/g;
				const matches = [...modifiedCode.matchAll(lastImportRegex)];
				if (matches.length > 0) {
					const lastImport = matches[matches.length - 1];
					const insertPosition = lastImport.index + lastImport[0].length;
					modifiedCode = modifiedCode.slice(0, insertPosition) + newImports + '\n' + modifiedCode.slice(insertPosition);
				}
			}

			// Erweitere entities.models
			const newModelEntries = newEntities.map(folder => `[${folder}.name.toLowerCase()]: ${folder}`).join(',\n');

			if (newModelEntries) {
				modifiedCode = modifiedCode.replace(
					/(entities\.models\s*=\s*{[^}]*)(})/s,
					(match, start, end) => {
						const hasExistingEntries = !start.match(/{\s*$/);
						const separator = hasExistingEntries ? ',\n' : '\n';
						return `${start}${separator}${newModelEntries}\n${end}`;
					}
				);
			}

			return {
				code: modifiedCode,
				map: null
			};
		}
	};
}