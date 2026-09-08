from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request

UA = "MyceliumV1/0.1 (local research)"
TAG = re.compile(r"<[^>]+>")


def wiki_search(query: str, limit: int = 3) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "srprop": "snippet",
            "format": "json",
        }
    )
    url = "https://en.wikipedia.org/w/api.php?" + params
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=8) as resp:
        data = json.loads(resp.read().decode())
    hits = data.get("query", {}).get("search", [])
    out = []
    for h in hits:
        title = h.get("title", "")
        snip = TAG.sub("", h.get("snippet", "")).replace("&quot;", '"')
        snip = re.sub(r"\s+", " ", snip).strip()
        text = f"{title}: {snip}" if snip else title
        out.append({"title": title, "text": text[:240]})
    return out
