import fs from 'fs';
import path from 'path';

// === Konfiguration ===
const ENTITY_BASE_DIR = path.resolve(process.cwd(), 'src/crm/entities');
const PROCESS_SUBDIR = 'db';
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/crm/generated/entities');

function getEntityDirs(baseDir: string): fs.Dirent[] {
  try {
    return fs.readdirSync(baseDir, { withFileTypes: true }).filter(d => d.isDirectory());
  } catch (e) {
    console.error('[entity-process-plugin] Fehler beim Lesen des Entity-Ordners:', e);
    return [];
  }
}

function findProcessFiles(entityPath: string): string[] {
  const processDir = path.join(entityPath, PROCESS_SUBDIR);
  const expectedProcesses = ['fromProcess', 'orderProcess', 'conditionProcess'];
  const foundProcesses: string[] = [];
  
  for (const proc of expectedProcesses) {
    const filePath = path.join(processDir, `${proc}.ts`);
    
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Entferne alle Kommentare vor der Prüfung
    const cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Block-Kommentare
      .replace(/\/\/.*$/gm, '');        // Zeilen-Kommentare
    
    if (cleanContent.includes(`export function ${proc}`) || 
        cleanContent.includes(`export const ${proc} =`)) {
      foundProcesses.push(proc);
    }
  }
  
  return foundProcesses;
}

function buildImportStatements(entityName: string, entityFile: string, processFiles: string[]): string[] {
  const imports: string[] = [];
  const relativeEntityImport = path.relative(OUTPUT_DIR, entityFile).replace(/\\/g, '/').replace(/\.ts$/, '');
  imports.push(`import ${entityName} from '${relativeEntityImport}';`);

  for (const proc of processFiles) {
    const procFile = path.join(ENTITY_BASE_DIR, entityName, PROCESS_SUBDIR, `${proc}.ts`);
    const relativeProcImport = path.relative(OUTPUT_DIR, procFile).replace(/\\/g, '/').replace(/\.ts$/, '');
    imports.push(`import { ${proc} } from '${relativeProcImport}';`);
  }
  imports.push('');
  return imports;
}

function buildAssignStatements(entityName: string, processFiles: string[]): string[] {
  return processFiles.map(proc => {
    const key = proc.replace('Process', '');
    return `${entityName}.db.${key}Process = ${proc};`;
  });
}

function writeCompiledFile(entityName: string, sourceCode: string): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outputFile = path.join(OUTPUT_DIR, `${entityName}_compiled.ts`);
  fs.writeFileSync(outputFile, sourceCode, 'utf8');
  console.log(`[entity-process-plugin] Generierte Datei: ${outputFile}`);
}
export default function entityCompilerPlugin() {
  return {
    name: 'entity-compiler',
    
    buildStart() {
      console.log('[entity-compiler] Starte Entity-Kompilierung...');
      
      const entityDirs = getEntityDirs(ENTITY_BASE_DIR);
      
      for (const dir of entityDirs) {
        const entityPath = path.join(ENTITY_BASE_DIR, dir.name);
        const entityFile = path.join(entityPath, `${dir.name}.ts`);
        
        if (!fs.existsSync(entityFile)) continue;
        
        const processFiles = findProcessFiles(entityPath);
        if (processFiles.length === 0) continue;
        
        const imports = buildImportStatements(dir.name, entityFile, processFiles);
        const assigns = buildAssignStatements(dir.name, processFiles);
        
        const compiledCode = [
          ...imports,
          ...assigns,
          '',
          `export default ${dir.name};`
        ].join('\n');
        
        writeCompiledFile(dir.name, compiledCode);
      }
    }
  };
}