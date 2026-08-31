---
layout: archive
title: "Ongoing Projects"
permalink: /projects/
author_profile: true
---

{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}

<div class="projects-list projects-page">

{% assign sorted_projects = site.projects | sort: "start_date" | reverse %}
{% for post in sorted_projects %}
  {% if post.ongoing or post.end_date == nil or post.end_date == "" %}
    {% include archive-single.html heading_level="h3" %}
  {% endif %}
{% endfor %}

</div>



