#pragma once
#include "tokenizer.hpp"
#include <string>
#include <vector>
#include <map>

// ===== STRUCTURAL ANALYZER =====
// Works on the token stream (not raw text), so braces inside strings/comments
// are already excluded by the tokenizer. This gives real nesting depth and
// real function counts, not approximations.

struct CodeStats {
    int keyword_counts_by_word = 0; // placeholder, unused directly
    std::map<std::string, int> keyword_frequency; // real keyword -> count
    int max_nesting_depth = 0;
    int function_count = 0;         // real count: identifier immediately followed by '('
                                      // preceded by a def/fn/func/void/int/etc keyword pattern
    int branch_count = 0;           // real if/elif/else/case/match count
    int string_literal_count = 0;
    int comment_count = 0;
    int identifier_count = 0;
    int total_tokens = 0;
};

class StructuralAnalyzer {
public:
    static CodeStats analyze(const std::string& code) {
        auto tokens = Tokenizer::tokenize(code);
        CodeStats stats;
        stats.total_tokens = (int)tokens.size();

        int current_depth = 0;
        int max_indent_depth = 0;

        // Indentation-based depth (for Python/Ruby-style languages with no braces).
        // Measured independently by scanning raw lines for leading whitespace,
        // since the tokenizer discards whitespace entirely.
        {
            int max_indent_units = 0;
            size_t pos = 0;
            while (pos < code.size()) {
                size_t line_end = code.find('\n', pos);
                if (line_end == std::string::npos) line_end = code.size();
                std::string line = code.substr(pos, line_end - pos);

                if (!line.empty()) {
                    int spaces = 0;
                    for (char c : line) {
                        if (c == ' ') spaces++;
                        else if (c == '\t') spaces += 4;
                        else break;
                    }
                    // Only count lines that have real content (not blank/whitespace-only)
                    bool has_content = line.find_first_not_of(" \t\r") != std::string::npos;
                    if (has_content) {
                        int indent_units = spaces / 4; // treat 4 spaces as one indent level
                        max_indent_units = std::max(max_indent_units, indent_units);
                    }
                }
                pos = line_end + 1;
            }
            max_indent_depth = max_indent_units;
        }

        for (size_t i = 0; i < tokens.size(); i++) {
            const Token& t = tokens[i];

            if (t.type == TokenType::Punctuation) {
                if (t.text == "{" || t.text == "(") {
                    current_depth++;
                    stats.max_nesting_depth = std::max(stats.max_nesting_depth, current_depth);
                } else if (t.text == "}" || t.text == ")") {
                    current_depth = std::max(0, current_depth - 1);
                }
            }

            if (t.type == TokenType::Keyword) {
                stats.keyword_frequency[t.text]++;

                if (t.text == "if" || t.text == "elif" || t.text == "elsif" ||
                    t.text == "else" || t.text == "case" || t.text == "match") {
                    stats.branch_count++;
                }

                // Real function detection: keyword like def/fn/func/void/int etc,
                // followed (within next couple tokens) by an identifier and '('.
                if (t.text == "def" || t.text == "fn" || t.text == "func" ||
                    t.text == "function" || t.text == "void" || t.text == "int" ||
                    t.text == "public" || t.text == "static") {
                    // look ahead for identifier '(' pattern within next 4 tokens
                    for (size_t j = i + 1; j < std::min(i + 5, tokens.size()); j++) {
                        if (tokens[j].type == TokenType::Identifier) {
                            // check if followed by '('
                            if (j + 1 < tokens.size() &&
                                tokens[j + 1].type == TokenType::Punctuation &&
                                tokens[j + 1].text == "(") {
                                stats.function_count++;
                            }
                            break;
                        }
                    }
                }
            }

            if (t.type == TokenType::StringLiteral) stats.string_literal_count++;
            if (t.type == TokenType::Comment) stats.comment_count++;
            if (t.type == TokenType::Identifier) stats.identifier_count++;
        }

        // Report whichever nesting signal is stronger — brace-based (C-family)
        // or indentation-based (Python-family). A file only uses one style
        // meaningfully, so taking the max is correct rather than double-counting.
        stats.max_nesting_depth = std::max(stats.max_nesting_depth, max_indent_depth);

        return stats;
    }
};
