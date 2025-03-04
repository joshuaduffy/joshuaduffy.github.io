---
layout: post
title:  "Test diagram!"
date:   2025-02-26 20:16:00 +0000
categories: jekyll diagram
---

{% mermaid %}
mindmap
    Heuristics
        Capable
        Reliable
        Secure
        Usable
        Scalable
        Performant
        Compatible
        Testable
{% endmermaid %}

{% mermaid %}
    quadrantChart
    quadrant-1 Automated
    quadrant-2 Manual
    quadrant-3 Non-deterministic
    quadrant-4 Deterministic
{% endmermaid %}

{% mermaid %}
flowchart TB
    unit --> component
    component --> integration
    integration --> e2e
{% endmermaid %}
