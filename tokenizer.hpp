#pragma once
#include <string>
#include <vector>
#include <set>
#include <cctype>

// ===== REAL TOKENIZER =====
// Replaces substring search (code.find("if")) with an actual lexer.
// Correctly skips string literals and comments, so "if" inside a string
// or comment is never counted as a keyword.

enum class TokenType {
    Identifier,
    Keyword,
    Number,
    StringLiteral,
    Operator,
    Punctuation,   // { } ( ) [ ] ; , 
    Comment,
    Unknown
};

struct Token {
    TokenType type;
    std::string text;
    int line;
};

class Tokenizer {
public:
    // Keywords across all languages we care about. A superset is fine —
    // we tag them as Keyword; per-language pattern logic decides what matters.
    static const std::set<std::string>& keyword_set() {
        static const std::set<std::string> kws = {
            // control flow
            "if", "else", "elif", "elsif", "while", "for", "do", "switch", "case",
            "break", "continue", "return", "yield", "match",
            // declarations
            "def", "fn", "func", "function", "class", "struct", "impl", "trait",
            "let", "var", "const", "int", "float", "double", "bool", "string",
            "void", "public", "private", "protected", "static",
            // error handling / concurrency
            "try", "catch", "except", "finally", "throw", "raise",
            "async", "await",
            // nix-specific
            "with", "rec", "in", "inherit", "import",
            // misc
            "new", "delete", "this", "self", "null", "nil", "true", "false"
        };
        return kws;
    }

    static std::vector<Token> tokenize(const std::string& code) {
        std::vector<Token> tokens;
        size_t i = 0;
        int line = 1;
        size_t n = code.size();

        while (i < n) {
            char c = code[i];

            if (c == '\n') { line++; i++; continue; }
            if (std::isspace((unsigned char)c)) { i++; continue; }

            // Line comments: // (C-family) and # (Python/Ruby/Nix)
            if (c == '/' && i + 1 < n && code[i + 1] == '/') {
                size_t start = i;
                while (i < n && code[i] != '\n') i++;
                tokens.push_back({TokenType::Comment, code.substr(start, i - start), line});
                continue;
            }
            if (c == '#') {
                size_t start = i;
                while (i < n && code[i] != '\n') i++;
                tokens.push_back({TokenType::Comment, code.substr(start, i - start), line});
                continue;
            }

            // Block comments: /* ... */
            if (c == '/' && i + 1 < n && code[i + 1] == '*') {
                size_t start = i;
                i += 2;
                while (i + 1 < n && !(code[i] == '*' && code[i + 1] == '/')) {
                    if (code[i] == '\n') line++;
                    i++;
                }
                i = std::min(i + 2, n);
                tokens.push_back({TokenType::Comment, code.substr(start, i - start), line});
                continue;
            }

            // String literals: "..." and '...'
            if (c == '"' || c == '\'') {
                char quote = c;
                size_t start = i;
                i++;
                while (i < n && code[i] != quote) {
                    if (code[i] == '\\' && i + 1 < n) i++; // skip escaped char
                    if (code[i] == '\n') line++;
                    i++;
                }
                i = std::min(i + 1, n);
                tokens.push_back({TokenType::StringLiteral, code.substr(start, i - start), line});
                continue;
            }

            // Identifiers / keywords
            if (std::isalpha((unsigned char)c) || c == '_') {
                size_t start = i;
                while (i < n && (std::isalnum((unsigned char)code[i]) || code[i] == '_')) i++;
                std::string word = code.substr(start, i - start);
                TokenType type = keyword_set().count(word) ? TokenType::Keyword : TokenType::Identifier;
                tokens.push_back({type, word, line});
                continue;
            }

            // Numbers (including decimals)
            if (std::isdigit((unsigned char)c)) {
                size_t start = i;
                while (i < n && (std::isdigit((unsigned char)code[i]) || code[i] == '.')) i++;
                tokens.push_back({TokenType::Number, code.substr(start, i - start), line});
                continue;
            }

            // Punctuation
            if (std::string("{}()[];,").find(c) != std::string::npos) {
                tokens.push_back({TokenType::Punctuation, std::string(1, c), line});
                i++;
                continue;
            }

            // Operators (anything else printable)
            if (std::isprint((unsigned char)c)) {
                tokens.push_back({TokenType::Operator, std::string(1, c), line});
                i++;
                continue;
            }

            i++; // skip unprintable/unknown
        }

        return tokens;
    }
};
