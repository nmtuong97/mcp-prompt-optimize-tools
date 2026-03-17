# mcp-prompt-optimize-tools 🚀

A Model Context Protocol (MCP) server for structured, iterative prompt optimization and strategic engineering.

Inspired by the [spences10/mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools), this tool transforms prompt engineering from a "guess-and-check" process into a rigorous, systematic pipeline.

## 🌟 Overview

**mcp-prompt-optimize-tools** acts as a "Prompt Architect" for your AI Agents. Instead of executing a raw, ambiguous user request immediately, this server forces the LLM to pause, analyze, critique, and reconstruct the prompt into a high-performance "Mega-Prompt" before final execution.

## ✨ Key Features

- **Iterative Refinement**: Breaks down prompt construction into logical steps (Analysis → Strategy → Construction).
- **Critical Reflection**: Forces the AI to identify weaknesses, ambiguities, and missing context in the original user input.
- **Persona & Context Enrichment**: Automatically assigns professional roles and injects technical constraints.
- **Tool Orchestration**: Suggests which other MCP tools (e.g., Search, File System, Git) should be integrated into the final workflow.
- **State Management**: Supports revisions and branching of thought, allowing the AI to backtrack and fix optimization errors.

## 🛠 How It Works

This tool provides a structured `thought` schema that the LLM must follow:

1.  **Analyze**: Evaluate the user's intent and identify what's missing.
2.  **Critique**: Peer-review the current prompt version for potential hallucinations or vagueness.
3.  **Synthesize**: Apply frameworks like Chain-of-Thought (CoT) or Role-Task-Format (RTF).
4.  **Orchestrate**: Recommend specific MCP tools to complement the task.
5.  **Output**: Deliver a final, production-ready prompt.

---

## 🚀 Quick Start

### Installation

```bash
npm install -g @nmtuong97/mcp-prompt-optimize-tools
```

### Configuration

Add this to your `claude_desktop_config.json` or Cursor `mcp.json`:

```json
{
  "mcpServers": {
    "prompt-optimizer": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-prompt-optimize-tools"
      ]
    }
  }
}
```

## 📝 Tool Parameters

The primary tool `optimize_prompt` accepts the following structured input:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `rawPrompt` | string | The original, unrefined user input. |
| `iteration` | number | The current step in the optimization sequence. |
| `criticism` | string | Self-identified flaws in the current version. |
| `suggestedRole` | string | The expert persona assigned to handle the task. |
| `optimizedPrompt` | string | The final, engineered prompt ready for execution. |

---

## 🤝 Contributing

This project is a fork and evolution of the sequential thinking concept. Contributions are welcome! Feel free to open issues or submit PRs to improve the optimization logic.

## 🙏 Credits & Acknowledgments

This project is a fork of [spences10/mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools) by **Scott Spence**, which itself was adapted from the Anthropic [Model Context Protocol servers](https://github.com/modelcontextprotocol/servers) reference implementation.

The foundational sequential thinking architecture and MCP tool coordination patterns are Scott Spence's original work. This repository extends that foundation specifically for prompt engineering and optimization use cases.

- **Original project:** [mcp-sequentialthinking-tools](https://github.com/spences10/mcp-sequentialthinking-tools) — Scott Spence
- **MCP specification & reference servers:** [Anthropic / Model Context Protocol](https://github.com/modelcontextprotocol)

## 📄 License

MIT © nmtuong97 (Modifications) | MIT © Scott Spence (Original Work)

See [LICENSE](./LICENSE) for full details.
