export type OptimizationFramework = 'CoT' | 'RTF' | 'Few-Shot' | 'CREATE' | 'CRISP';

export interface PromptOptimizationData {
	rawPrompt: string;
	iteration: number;
	appliedFramework: OptimizationFramework;
	criticism: string;
	suggestedRole: string;
	optimizedPrompt: string;
	suggestedMcpTools?: string;
	nextIterationNeeded?: boolean;
	isRevision?: boolean;
	revisesIteration?: number;
	branchFromIteration?: number;
	branchId?: string;
}

export interface Tool {
	name: string;
	description: string;
	inputSchema: Record<string, unknown>;
}

export interface ServerConfig {
	available_tools: Map<string, Tool>;
}
