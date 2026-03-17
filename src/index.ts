#!/usr/bin/env node

// adapted from https://github.com/modelcontextprotocol/servers/blob/main/src/sequentialthinking/index.ts
// for use with mcp tools

import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { StdioTransport } from '@tmcp/transport-stdio';
import * as v from 'valibot';
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PromptOptimizationSchema, PROMPT_OPTIMIZE_TOOL } from './schema.js';
import { PromptOptimizationData, Tool } from './types.js';

// Get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const package_json = JSON.parse(
	readFileSync(join(__dirname, '../package.json'), 'utf-8'),
);
const { name, version } = package_json;

// Create MCP server with tmcp
const adapter = new ValibotJsonSchemaAdapter();
const server = new McpServer(
	{
		name,
		version,
		description: 'MCP server for structured prompt optimization',
	},
	{
		adapter,
		capabilities: {
			tools: { listChanged: true },
		},
	},
);

interface ServerOptions {
	available_tools?: Tool[];
	maxHistorySize?: number;
}

class PromptOptimizerServer {
	private optimization_history: PromptOptimizationData[] = [];
	private branches: Record<string, PromptOptimizationData[]> = {};
	private available_tools: Map<string, Tool> = new Map();
	private maxHistorySize: number;

	public getAvailableTools(): Tool[] {
		return Array.from(this.available_tools.values());
	}

	constructor(options: ServerOptions = {}) {
		this.maxHistorySize = options.maxHistorySize || 1000;
		
		// Always include the prompt optimization tool
		const tools = [
			PROMPT_OPTIMIZE_TOOL,
			...(options.available_tools || []),
		];

		// Initialize with provided tools
		tools.forEach((tool) => {
			if (this.available_tools.has(tool.name)) {
				console.error(
					`Warning: Duplicate tool name '${tool.name}' - using first occurrence`,
				);
				return;
			}
			this.available_tools.set(tool.name, tool);
		});

		console.error(
			'Available tools:',
			Array.from(this.available_tools.keys()),
		);
	}

	public clearHistory(): void {
		this.optimization_history = [];
		this.branches = {};
		console.error('History cleared');
	}

	public addTool(tool: Tool): void {
		if (this.available_tools.has(tool.name)) {
			console.error(`Warning: Tool '${tool.name}' already exists`);
			return;
		}
		this.available_tools.set(tool.name, tool);
		console.error(`Added tool: ${tool.name}`);
	}

	public discoverTools(): void {
		// In a real implementation, this would scan the environment
		// for available MCP tools and add them to available_tools
		console.error('Tool discovery not implemented - manually add tools via addTool()');
	}

	private formatOptimization(optimizationData: PromptOptimizationData): string {
		const {
			rawPrompt,
			iteration,
			appliedFramework,
			criticism,
			suggestedRole,
			optimizedPrompt,
			suggestedMcpTools,
			isRevision,
			revisesIteration,
			branchFromIteration,
			branchId,
		} = optimizationData;

		let prefix = '';
		let context = '';

		if (isRevision) {
			prefix = chalk.yellow('🔄 Sửa đổi');
			context = ` (từ vòng lặp ${revisesIteration})`;
		} else if (branchFromIteration) {
			prefix = chalk.green('🌿 Nhánh mới');
			context = ` (từ vòng lặp ${branchFromIteration}, ID: ${branchId})`;
		} else {
			prefix = chalk.blue('✨ Tối ưu');
			context = '';
		}

		let outputText = `[Báo cáo Tối ưu hóa Prompt - Lần ${iteration}]${context}\n`;
		outputText += `- 📌 Framework áp dụng: **${appliedFramework}**\n`;
		outputText += `- 🔍 Phê bình / Phân tích (Criticism): ${criticism}\n`;
		if (suggestedRole) {
			outputText += `- 🎭 Vai trò đề xuất: ${suggestedRole}\n`;
		}
		outputText += `- 📝 Prompt Dự thảo:\n---\n${optimizedPrompt}\n---\n`;
		if (suggestedMcpTools) {
			outputText += `- 🛠️ Công cụ MCP khuyên dùng kèm: ${suggestedMcpTools}\n`;
		}

		const header = `${prefix} Lần ${iteration}${context}`;
		const border = '─'.repeat(Math.max(header.length, 50) + 4);
		console.error(`\n┌${border}┐\n│ ${header.padEnd(border.length - 2)} │\n├${border}┤\n│ Áp dụng: ${appliedFramework.padEnd(border.length - 11)}│\n└${border}┘`);

		return outputText;
	}

	public async processOptimization(input: v.InferInput<typeof PromptOptimizationSchema>) {
		try {
			// Input is already validated by tmcp with Valibot
			const validatedInput = input as PromptOptimizationData;

			this.optimization_history.push(validatedInput);
		
			// Prevent memory leaks by limiting history size
			if (this.optimization_history.length > this.maxHistorySize) {
				this.optimization_history = this.optimization_history.slice(-this.maxHistorySize);
				console.error(`History trimmed to ${this.maxHistorySize} items`);
			}

			if (
				validatedInput.branchFromIteration &&
				validatedInput.branchId
			) {
				if (!this.branches[validatedInput.branchId]) {
					this.branches[validatedInput.branchId] = [];
				}
				this.branches[validatedInput.branchId].push(validatedInput);
			}

			const formattedOptimization = this.formatOptimization(validatedInput);
			console.error(formattedOptimization);

			return {
				content: [
					{
						type: 'text' as const,
						text: formattedOptimization,
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify(
							{
								error:
									error instanceof Error
										? error.message
										: String(error),
								status: 'failed',
							},
							null,
							2,
						),
					},
				],
				isError: true,
			};
		}
	}

	// Tool execution is handled by the MCP client.
	// This server focuses on prompt optimization state and formatting.
}

// Read configuration from environment variables or command line args
const maxHistorySize = parseInt(process.env.MAX_HISTORY_SIZE || '1000');

const promptOptimizerServer = new PromptOptimizerServer({
	available_tools: [], // TODO: Add tool discovery mechanism
	maxHistorySize,
});

// Register the prompt optimization tool
server.tool(
	{
		name: PROMPT_OPTIMIZE_TOOL.name,
		description: PROMPT_OPTIMIZE_TOOL.description,
		schema: PromptOptimizationSchema,
	},
	async (input) => {
		return promptOptimizerServer.processOptimization(input);
	},
);

async function main() {
	const transport = new StdioTransport(server);
	transport.listen();
	console.error('Prompt Optimization MCP Server running on stdio');
}

main().catch((error) => {
	console.error('Fatal error running server:', error);
	process.exit(1);
});
