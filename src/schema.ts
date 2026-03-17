import * as v from 'valibot';
import { Tool } from './types.js';

const TOOL_DESCRIPTION = `A structured tool for iterative prompt optimization and strategic engineering.
This tool helps refine an initial prompt through critique, role assignment, and targeted rewrites.
Each iteration can improve, revise, or branch from previous optimization work as understanding deepens.

IMPORTANT: This server facilitates structured prompt optimization. The LLM should critique weak or missing details, assign the best role for the task, and produce a stronger optimized prompt for the next iteration.

When to use this tool:
- Transforming a rough user request into a production-ready prompt
- Iteratively refining prompts with critique and revision
- Assigning a clearer expert persona or execution role
- Improving prompts that are vague, underspecified, or likely to hallucinate
- Prompt engineering workflows that benefit from structured iteration

Key features:
- Tracks iterative prompt improvements
- Captures critique for each optimization pass
- Suggests an expert role to guide execution
- Supports revisions and optional branching between prompt variants
- Preserves optimization history for multi-step refinement

Parameters explained:
- rawPrompt: The original prompt or request that needs improvement
- iteration: The current optimization pass
- criticism: The key weaknesses, gaps, or risks in the current prompt
- suggestedRole: The expert persona best suited for handling the task
- optimizedPrompt: The rewritten, higher-quality prompt produced for this iteration
- nextIterationNeeded: True when another optimization pass is still needed
- isRevision: Whether this iteration revises a previous optimization
- revisesIteration: Which earlier iteration is being reconsidered
- branchFromIteration: If branching, which iteration this branch extends from
- branchId: Identifier for the current branch (if any)

You should:
1. Begin with the original prompt and identify missing details
2. Record clear criticism for each iteration
3. Choose a role that improves the quality of the final result
4. Produce a stronger optimized prompt on every pass
5. Use revisions or branches when exploring alternate prompt strategies
6. Only mark optimization as complete when the prompt is ready for execution`;

export const PromptOptimizationSchema = v.object({
	rawPrompt: v.pipe(
		v.string(),
		v.description('The original prompt or request to optimize')
	),
	iteration: v.pipe(
		v.number(),
		v.minValue(1),
		v.description('Current optimization iteration number')
	),
	criticism: v.pipe(
		v.string(),
		v.description('Critique of the current or original prompt')
	),
	suggestedRole: v.pipe(
		v.string(),
		v.description('Recommended expert role or persona for the task')
	),
	optimizedPrompt: v.pipe(
		v.string(),
		v.description('Improved prompt generated for this iteration')
	),
	nextIterationNeeded: v.optional(v.pipe(
		v.boolean(),
		v.description('Whether another optimization pass is needed')
	)),
	isRevision: v.optional(v.pipe(
		v.boolean(),
		v.description('Whether this iteration revises previous optimization work')
	)),
	revisesIteration: v.optional(v.pipe(
		v.number(),
		v.minValue(1),
		v.description('Which optimization iteration is being reconsidered')
	)),
	branchFromIteration: v.optional(v.pipe(
		v.number(),
		v.minValue(1),
		v.description('Optimization iteration that this branch extends from')
	)),
	branchId: v.optional(v.pipe(
		v.string(),
		v.description('Identifier for the current optimization branch')
	))
});

export const PROMPT_OPTIMIZE_TOOL: Tool = {
	name: 'optimize_prompt',
	description: TOOL_DESCRIPTION,
	inputSchema: {} // This will be handled by tmcp with the schema above
};
