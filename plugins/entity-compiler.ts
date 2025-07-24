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
                'colorProcess'            // Dynamische Farbe
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