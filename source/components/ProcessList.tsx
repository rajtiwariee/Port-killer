import React, {useState, useEffect} from 'react';
import {Box, Text, useInput} from 'ink';
import type {ProcessInfo} from '../utils/processes.js';

interface Props {
	processes: ProcessInfo[];
	onKill: (process: ProcessInfo) => void;
}

export const ProcessList: React.FC<Props> = ({processes, onKill}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useInput((input, key) => {
		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}

		if (key.downArrow) {
			setSelectedIndex(prev => Math.min(processes.length - 1, prev + 1));
		}

		if (key.return) {
			const selectedProcess = processes[selectedIndex];
			if (selectedProcess) {
				onKill(selectedProcess);
			}
		}
	});

    // Reset selection if list changes and index is out of bounds
    useEffect(() => {
        if (selectedIndex >= processes.length && processes.length > 0) {
            setSelectedIndex(processes.length - 1);
        }
    }, [processes.length]);

	if (processes.length === 0) {
		return (
            <Box padding={1}>
                <Text color="yellow">No processes found matching criteria.</Text>
            </Box>
        );
	}

    const visibleProcesses = processes.slice(Math.max(0, selectedIndex - 5), selectedIndex + 5);

	return (
		<Box flexDirection="column" width="100%">
			<Box marginBottom={1} borderStyle="single" borderColor="gray" paddingX={1}>
				<Text color="gray">Use <Text bold color="white">↑/↓</Text> to navigate, <Text bold color="red">Enter</Text> to kill.</Text>
			</Box>
            
            {/* Header */}
            <Box paddingX={2} marginBottom={0}>
                <Box width="50%"><Text color="gray" bold>PROCESS NAME</Text></Box>
                <Box width="25%"><Text color="gray" bold>PID</Text></Box>
                <Box width="25%"><Text color="gray" bold>PORT</Text></Box>
            </Box>

            {/* List */}
			{processes.map((process, index) => {
				const isSelected = index === selectedIndex;
                const bgColor = isSelected ? '#222222' : undefined; // Ink doesn't support bg hex directly easily without chalk, but we can use color attributes

				return (
					<Box key={`${process.pid}-${process.port}`} paddingX={1}>
                        <Box width={2}>
                            <Text color="green">{isSelected ? '❯' : ' '}</Text>
                        </Box>

                        <Box width="50%">
                            <Text 
                                bold={isSelected} 
                                color={isSelected ? 'cyan' : 'white'}
                                wrap="truncate"
                            >
                                {process.name}
                            </Text>
                        </Box>
                        
                        <Box width="25%">
                             <Text color={isSelected ? 'white' : 'gray'}>
                                {process.pid}
                            </Text>
                        </Box>

                        <Box width="25%">
                             <Text color={isSelected ? 'yellow' : 'blue'}>
                                :{process.port}
                            </Text>
                        </Box>
					</Box>
				);
			})}
		</Box>
	);
};
