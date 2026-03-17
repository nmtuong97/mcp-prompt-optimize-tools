import * as v from 'valibot';
import { Tool } from './types.js';

const TOOL_DESCRIPTION = `A structured tool for iterative prompt optimization and strategic prompt engineering.
This tool transforms a raw, ambiguous user request into a high-performance "Mega-Prompt" through a rigorous, systematic pipeline.

IMPORTANT: This server acts as a "Prompt Architect". Instead of executing a raw request immediately, the LLM must pause, analyze, critique, and reconstruct the prompt before final execution.

When to use this tool:
- When the user's input is vague, ambiguous, or missing critical context
- When you want to apply Chain-of-Thought (CoT) or Role-Task-Format (RTF) frameworks
- When assigning a professional expert persona would improve output quality
- When the prompt needs iterative refinement across multiple steps
- When you need to identify hallucination risks or logical gaps before execution
- When orchestrating multiple MCP tools into a cohesive workflow
- When producing a final, production-ready prompt for another LLM or agent

Optimization pipeline:
1. Analyze  - Evaluate the user's intent and identify what's missing
2. Critique - Peer-review the current prompt version for weaknesses or vagueness
3. Synthesize - Apply proven frameworks (CoT, RTF, STAR) to restructure the prompt
4. Orchestrate - Recommend specific MCP tools to complement the workflow
5. Output - Deliver a final, refined prompt ready for execution

Parameters explained:
- available_mcp_tools: Array of MCP tool names available in the current session (e.g., ["mcp-omnisearch", "mcp-filesystem"])
- thought: The current optimization step, which can include:
  * Analysis of the original user intent
  * Identification of missing context or constraints
  * Critique of the previous prompt draft
  * Application of a prompt engineering framework
  * Assignment of an expert role or persona
  * Hypothesis about the ideal final prompt structure
- next_thought_needed: True if further optimization steps are required
- thought_number: Current step number in the optimization sequence
- total_thoughts: Estimated total steps needed (can be adjusted as the pipeline evolves)
- is_revision: True if this step revises or overrides a previous optimization step
- revises_thought: If is_revision is true, which step number is being reconsidered
- branch_from_thought: If exploring an alternative optimization path, the branching step number
- branch_id: Identifier for the alternative optimization branch
- needs_more_thoughts: Set to true if additional steps are needed beyond the initial estimate
- criticism: Self-identified flaws, ambiguities, or weaknesses in the current prompt draft
- suggested_role: The expert persona or professional role to assign (e.g., "Senior Python Engineer", "UX Researcher")
- refined_prompt: The engineered prompt draft produced at this optimization step
- current_step: Current step recommendation, including:
  * step_description: What optimization action needs to be taken
  * recommended_tools: MCP tools recommended to assist this step
  * expected_outcome: What the output of this step should look like
  * next_step_conditions: Conditions that determine what comes next
- previous_steps: Optimization steps already completed
- remaining_steps: High-level descriptions of upcoming optimization steps

You should:
1. Begin with a thorough analysis of the original user input
2. Explicitly identify missing context, ambiguous terms, and unstated constraints
3. Assign an expert persona that best matches the task domain
4. Apply at least one structured prompt framework (CoT, RTF, STAR, etc.)
5. Critique each draft before finalizing it
6. Recommend MCP tools that would enhance the final workflow
7. Adjust total_thoughts freely as the optimization unfolds
8. Revise or branch when a previous step proves insufficient
9. Set next_thought_needed to false only when the refined_prompt is production-ready
10. Output a single, high-quality refined_prompt as the final result`;

export const ToolRecommendationSchema = v.object({
tool_name: v.pipe(
v.string(),
v.description('Name of the tool being recommended')
),
confidence: v.pipe(
v.number(),
v.minValue(0),
v.maxValue(1),
v.description('0-1 indicating confidence in recommendation')
),
rationale: v.pipe(
v.string(),
v.description('Why this tool is recommended')
),
priority: v.pipe(
v.number(),
v.description('Order in the recommendation sequence')
),
suggested_inputs: v.optional(v.pipe(
v.record(v.string(), v.unknown()),
v.description('Optional suggested parameters')
)),
alternatives: v.optional(v.pipe(
v.array(v.string()),
v.description('Alternative tools that could be used')
))
});

export const StepRecommendationSchema = v.object({
step_description: v.pipe(
v.string(),
v.description('What optimization action needs to be taken')
),
recommended_tools: v.pipe(
v.array(ToolRecommendationSchema),
v.description('MCP tools recommended to assist this step')
),
expected_outcome: v.pipe(
v.string(),
v.description('What the output of this step should look like')
),
next_step_conditions: v.optional(v.pipe(
v.array(v.string()),
v.description('Conditions that determine what comes next')
))
});

export const OptimizePromptSchema = v.object({
available_mcp_tools: v.pipe(
v.array(v.string()),
v.description('Array of MCP tool names available in the current session (e.g., ["mcp-omnisearch", "mcp-filesystem"])')
),
thought: v.pipe(
v.string(),
v.description('The current optimization step — analysis, critique, synthesis, or persona assignment')
),
next_thought_needed: v.pipe(
v.boolean(),
v.description('Whether another optimization step is needed')
),
thought_number: v.pipe(
v.number(),
v.minValue(1),
v.description('Current step number in the optimization sequence')
),
total_thoughts: v.pipe(
v.number(),
v.minValue(1),
v.description('Estimated total steps needed (can be adjusted as the pipeline evolves)')
),
is_revision: v.optional(v.pipe(
v.boolean(),
v.description('True if this step revises or overrides a previous optimization step')
)),
revises_thought: v.optional(v.pipe(
v.number(),
v.minValue(1),
v.description('If is_revision is true, which step number is being reconsidered')
)),
branch_from_thought: v.optional(v.pipe(
v.number(),
v.minValue(1),
v.description('If exploring an alternative optimization path, the branching step number')
)),
branch_id: v.optional(v.pipe(
v.string(),
v.description('Identifier for the alternative optimization branch')
)),
needs_more_thoughts: v.optional(v.pipe(
v.boolean(),
v.description('Set to true if additional steps are needed beyond the initial estimate')
)),
criticism: v.optional(v.pipe(
v.string(),
v.description('Self-identified flaws, ambiguities, or weaknesses in the current prompt draft')
)),
suggested_role: v.optional(v.pipe(
v.string(),
v.description('Expert persona or professional role to assign (e.g., "Senior Python Engineer", "UX Researcher")')
)),
refined_prompt: v.optional(v.pipe(
v.string(),
v.description('The engineered prompt draft produced at this optimization step')
)),
current_step: v.optional(v.pipe(
StepRecommendationSchema,
v.description('Current step recommendation for MCP tool orchestration')
)),
previous_steps: v.optional(v.pipe(
v.array(StepRecommendationSchema),
v.description('Optimization steps already completed')
)),
remaining_steps: v.optional(v.pipe(
v.array(v.string()),
v.description('High-level descriptions of upcoming optimization steps')
))
});

export const OPTIMIZE_PROMPT_TOOL: Tool = {
name: 'optimize_prompt',
description: TOOL_DESCRIPTION,
inputSchema: {} // This will be handled by tmcp with the schema above
};
