import React, {useState, useEffect} from 'react';
import {Text, Box, useApp} from 'ink';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import {ProcessInfo, getRunningProcesses, killProcess} from './utils/processes.js';
import {ProcessList} from './components/ProcessList.js';

export default function App() {
    const {exit} = useApp();
	const [processes, setProcesses] = useState<ProcessInfo[]>([]);
	const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

	const fetchProcesses = async () => {
		setLoading(true);
		try {
			const list = await getRunningProcesses();
			setProcesses(list);
            setLoading(false);
		} catch (error) {
            setLoading(false);
			// Handle error
		}
	};

	useEffect(() => {
		fetchProcesses();
        // Optional: poll every 5 seconds?
        const interval = setInterval(fetchProcesses, 5000);
        return () => clearInterval(interval);
	}, []);

	const handleKill = async (process: ProcessInfo) => {
        setMessage(`Killing process ${process.name} (PID: ${process.pid})...`);
		try {
			await killProcess(process.pid);
            setMessage(`Successfully killed ${process.name}.`);
            // Refresh immediately
            await fetchProcesses();
            // Clear message after 2s
            setTimeout(() => setMessage(null), 2000);
		} catch (error) {
			setMessage(`Error killing process: ${String(error)}`);
		}
	};

	return (
		<Box flexDirection="column" padding={1}>
			<Gradient name="pastel">
				<BigText text="Port Killer" font="tiny" />
			</Gradient>
            
            {message && (
                <Box borderStyle="single" borderColor="green" marginBottom={1} paddingX={1}>
                    <Text>{message}</Text>
                </Box>
            )}

            <Box flexDirection="column">
                {loading && processes.length === 0 ? (
                    <Text color="gray">Scanning ports...</Text>
                ) : (
                    <ProcessList processes={processes} onKill={handleKill} />
                )}
            </Box>
		</Box>
	);
}
