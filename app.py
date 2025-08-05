def ai_score(text):
    score = 0

    text_lower = text.lower()

    # Penalize if not HTTPS
    if "https://" not in text_lower:
        score += 30

    # Count suspicious keywords frequency
    keywords = {
        "password": 20,
        "login": 15,
        "verify": 15,
        "update": 10,
        "bank": 25,
        "credentials": 20,
    }

    for kw, points in keywords.items():
        count = text_lower.count(kw)
        score += min(count * points, points * 3)  # max triple points for repeated keywords

    # Count number of script tags
    script_count = text_lower.count("<script")
    if script_count > 5:
        score += 10 + (script_count - 5) * 2  # extra penalty for many scripts

    # Penalize if iframe used (common in phishing)
    if "iframe" in text_lower:
        score += 15

    # Clamp score to max 100
    if score > 100:
        score = 100

    return int(score)
