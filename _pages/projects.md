---
layout: archive
title: "Projects"
permalink: /projects/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

<h2>Ongoing</h2>

{% assign sorted_projects = site.projects | sort: "start_date" | reverse %}
{% for post in sorted_projects %}
  {% unless post.end_date %}
    {% include archive-single.html %}
  {% endunless %}
{% endfor %}

<h2>Published</h2>

{% assign has_published = false %}
{% for post in sorted_projects %}
  {% if post.end_date %}
    {% assign has_published = true %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}

{% unless has_published %}
  <p>No publications yet, but stay tuned!</p>
{% endunless %}



