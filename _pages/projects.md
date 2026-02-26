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

<div class="projects-list">

<h2 class="archive__subtitle">Ongoing</h2>

{% assign sorted_projects = site.projects | sort: "start_date" | reverse %}
{% for post in sorted_projects %}
  {% if post.ongoing or post.end_date == nil or post.end_date == "" %}
    {% include archive-single.html heading_level="h3" %}
  {% endif %}
{% endfor %}

<h2 class="archive__subtitle">Previous</h2>

{% assign has_previous = false %}
{% for post in sorted_projects %}
  {% if post.end_date and post.ongoing != true %}
    {% assign has_previous = true %}
    {% include archive-single.html heading_level="h3" %}
  {% endif %}
{% endfor %}

{% unless has_previous %}
  <p>No previous projects yet.</p>
{% endunless %}

</div>



