import * as v from 'valibot';
import { Tool } from './types.js';

const TOOL_DESCRIPTION = `A structured tool for iterative prompt optimization and strategic engineering.

QUY ĐỊNH BẮT BUỘC KHI TỐI ƯU PROMPT:
Bạn PHẢI chọn và áp dụng 1 trong 5 kỹ thuật (Framework) sau đây vào bản tối ưu (optimizedPrompt):
1. CoT (Chain-of-Thought): Yêu cầu AI suy luận từng bước trước khi trả lời.
2. RTF (Role-Task-Format): Xác định rõ Vai trò, Nhiệm vụ và Định dạng đầu ra.
3. Few-Shot: Cung cấp trước một số ví dụ (examples) về input/output chuẩn.
4. CREATE (Context, Request, Explanation, Action, Tone, Extra): Đầy đủ ngữ cảnh, yêu cầu, hành động và giọng điệu.
5. CRISP (Context, Request, Intent, Specifics, Persona): Ngắn gọn, tập trung vào mục đích cụ thể.

Parameters explained:
- rawPrompt: The original prompt
- iteration: Current optimization pass
- appliedFramework: MUST be one of: 'CoT', 'RTF', 'Few-Shot', 'CREATE', 'CRISP'
- criticism: Weaknesses in the current prompt
- suggestedRole: The expert persona
- optimizedPrompt: The rewritten, higher-quality prompt based on the chosen framework
- suggestedMcpTools: Recommended MCP tools to use alongside this prompt (e.g., "puppeteer", "github")
`;

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
	appliedFramework: v.pipe(
		v.picklist(['CoT', 'RTF', 'Few-Shot', 'CREATE', 'CRISP']),
		v.description('BẮT BUỘC: Chọn 1 trong 5 kỹ thuật tối ưu này')
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
	suggestedMcpTools: v.optional(v.pipe(
		v.string(),
		v.description('Gợi ý công cụ MCP nên dùng kèm (tuỳ chọn)')
	)),
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
	inputSchema: {}
};
