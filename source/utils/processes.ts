import {promisify} from 'node:util';
import {exec} from 'node:child_process';
import fkill from 'fkill';

const execAsync = promisify(exec);

export interface ProcessInfo {
	pid: number;
	name: string;
	port: number;
}

export async function getRunningProcesses(): Promise<ProcessInfo[]> {
	try {
        // -F pcn: Output format for machine parsing (PID, Command, Name)
        // -i: select internet files
        // -P: no port names
        // -n: no host names
        // -sTCP:LISTEN: only listening TCP ports
		const {stdout} = await execAsync('lsof -i -P -n -sTCP:LISTEN -F pcn');
		
		const processes: ProcessInfo[] = [];
        let currentPid = 0;
        let currentCmd = '';
        
        const lines = stdout.split('\n');
        for (const line of lines) {
            if (!line) continue;
            
            const type = line.charAt(0);
            const value = line.slice(1);
            
            if (type === 'p') {
                currentPid = parseInt(value, 10);
                currentCmd = ''; // Reset command for new PID
            } else if (type === 'c') {
                currentCmd = value;
            } else if (type === 'n') {
                // Format is usually *:PORT or IP:PORT
                const portPart = value.split(':').pop();
                if (portPart) {
                    const port = parseInt(portPart, 10);
                    if (!isNaN(port) && currentPid > 0) {
                        processes.push({
                            pid: currentPid,
                            name: currentCmd || 'unknown',
                            port
                        });
                    }
                }
            }
        }

        // Deduplicate
        const unique = new Map<string, ProcessInfo>();
        for (const p of processes) {
             unique.set(`${p.pid}-${p.port}`, p);
        }
        
        return Array.from(unique.values()).sort((a,b) => a.port - b.port);

	} catch (error: any) {
        // lsof returns exit code 1 if no matching files are found
        if (error.code === 1) return [];
		console.error('Error fetching processes:', error);
        return [];
	}
}

export async function killProcess(pid: number) {
	await fkill(pid, {force: true});
}
