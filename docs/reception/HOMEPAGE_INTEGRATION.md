# Homepage Reception Integration

Selected reader reactions can appear under episode pages on The Thirteenth Path website, but only as curated public reception snippets.

## Recommendation

Show a small `Reader Response` or `Selected Response` block under each episode.

Each item should include:

- a short excerpt or AOI-written summary;
- the episode it responds to;
- source platform;
- a stable public link when available;
- an anonymous or public-handle credit according to the rules in [README.md](README.md).

Do not embed full private comments, private Telegram messages, or screenshots of conversations.

## Suggested Data Shape

```json
{
  "episode": "ko/01_opening_arc/01_burned_name",
  "sourcePlatform": "Naver Webnovel",
  "sourceUrl": "https://example.com/public-comment",
  "credit": "anonymous",
  "language": "ko",
  "excerpt": "Short public excerpt only.",
  "summary": "AOI-written summary of what this response shows.",
  "tags": ["name", "inciting-case", "return-intent"],
  "permission": "public-source-short-excerpt"
}
```

## Website Behavior

- Keep the block below the episode text, never above the story.
- Limit visible entries to one to three per episode.
- Prefer summaries when the original comment is long.
- Link out to public source comments instead of copying whole comments.
- Hide entries without a public source URL unless explicit display permission exists.
- Do not show private handles, message IDs, or platform-internal metadata.
- Preserve spoiler boundaries: do not show later-episode reactions below earlier episodes.

## Product Value

This gives readers proof that the work is being read without turning the site into a review wall.

For future partner packets, the same structured entries can support qualitative evidence:

- episode resonance;
- character attachment;
- comprehension of the names/routes/order motif;
- language-edition reception;
- app/music/Codex response;
- AI collaboration trust or curiosity signals.

## Boundary

This is an implementation guideline only.

Adding this document does not publish any actual reader comment, change the website, modify privacy terms, collect data, or authorize scraping platform comments.
