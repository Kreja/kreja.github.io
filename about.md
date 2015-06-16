---
layout: page
title: About
permalink: /about/
---

{% if site.gavatar %}
<img class="avatar lg" src="{{site.gavatar}}" alt="avatar">
{% endif %}

I'm Kelly.{% if site.address %}
I'm from [{{site.address}}]({{site.address_link}}).
{% endif %}

---

## contacts

{% if site.email %}
You can <a href="mailto:{{ site.email }}">Email</a> me
{% endif %}
I'm also on {% if site.github_username %}
<a href="https://github.com/{{ site.github_username }}">
	<span class="username">Github</span></a>{% endif %}{% if site.twitter_username %}<span>, </span>
<a href="https://twitter.com/{{ site.twitter_username }}">
	<span class="username">Twitter</span></a>{% endif %}{% if site.weibo_username %}<span>, </span>
<a href="http://weibo.com/{{ site.weibo_username }}">
	<span class="username">Weibo</span></a>{% endif %}{% if site.douban_username %}<span>, </span>
<a href="http://www.douban.com/people/{{ site.douban_username }}">
	<span class="username">Douban</span></a>{% endif %}.


