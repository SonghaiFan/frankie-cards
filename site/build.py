#!/usr/bin/env python3
"""Build Cards' independent bilingual introduction; never reads environment files."""
import argparse,html,json,shutil
from pathlib import Path
H=html.escape

def build(repo,out):
 cfg=json.loads((repo/'site/project.json').read_text());content=json.loads((repo/'site/content.json').read_text());out.mkdir(parents=True,exist_ok=True);media=out/'media';media.mkdir(exist_ok=True)
 shutil.copy(repo/'public/frankcards-site.css',out/'brand.css')
 for n in ['style.css','demo.js']:shutil.copy(repo/'site'/n,out/n)
 for src,dest in [('docs/readme/assets/frankie.svg','signature.svg'),('docs/readme/banner.png','banner.png'),('public/card-energy-shapes.png','energy-shapes.png'),('site/assets/question-current.png','question.png'),('site/assets/library-current.png','library.png'),('site/assets/settings-current.png','settings.png'),('site/assets/demo.gif','demo.gif')]:shutil.copy(repo/src,media/dest)
 (out/'.nojekyll').touch()
 for lang,c in content.items():
  zh=lang=='zh';pre='../' if zh else './';dest=out/'zh' if zh else out;dest.mkdir(exist_ok=True)
  source=repo/('public/games/zh/confidence-boost-CN.json' if zh else 'public/games/en/confidence-boost.json');pack=json.loads(source.read_text());questions=[q for group in pack['questions'] for q in group['questions'] if q.get('type')!='end']
  data=json.dumps({'questions':questions,'energy':c['energy']},ensure_ascii=False).replace('<','\\u003c')
  articles=lambda xs:''.join('<article><h3>'+H(a)+'</h3><p>'+H(b)+'</p></article>' for a,b in xs)
  gallery=''.join(f'<figure><a href="{pre}media/{name}.png"><img src="{pre}media/{name}.png" alt="{H(caption,quote=True)}" loading="lazy" width="1468" height="1247"></a><figcaption>{H(caption)}</figcaption></figure>' for name,caption in zip(['question','library','settings'],c['captions']))
  page=f'''<!doctype html><html lang="{'zh-CN' if zh else 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Frankie Cards | {H(c['headline'])}</title><meta name="description" content="{H(c['intro'],quote=True)}"><meta name="theme-color" content="#f2f2ef"><link rel="canonical" href="{cfg['pages_url']+('zh/' if zh else '')}"><link rel="alternate" hreflang="en" href="{cfg['pages_url']}"><link rel="alternate" hreflang="zh-CN" href="{cfg['pages_url']}zh/"><link rel="stylesheet" href="{pre}brand.css"><link rel="stylesheet" href="{pre}style.css"><meta property="og:type" content="website"><meta property="og:title" content="Frankie Cards"><meta property="og:description" content="{H(c['intro'],quote=True)}"><meta property="og:url" content="{cfg['pages_url']+('zh/' if zh else '')}"><meta property="og:image" content="{cfg['pages_url']}media/banner.png"></head><body>
<a class="skip" href="#main">{'跳至内容' if zh else 'Skip to content'}</a><header class="shell site-header"><a class="brand site-brand" href="{pre}"><img src="{pre}media/signature.svg" width="78" height="33" alt="Frankie"><strong>Cards</strong></a><nav class="site-nav" aria-label="{'页面导航' if zh else 'Page navigation'}"><a href="#cards">{c['nav'][0]}</a><a href="#use">{c['nav'][1]}</a><a href="#screens">{c['nav'][2]}</a><a href="{pre}" lang="en" {'aria-current="page"' if not zh else ''}>EN</a><a href="{pre}zh/" lang="zh-CN" {'aria-current="page"' if zh else ''}>中文</a></nav></header>
<main id="main" class="shell"><section class="hero"><div><h1>{H(c['headline'])}</h1><p class="lead">{H(c['intro'])}</p><div class="actions"><a class="button" href="{cfg['app_url']}">{H(c['open'])} ↗</a><a href="#preview">{H(c['try'])}</a></div></div><figure class="hero-screen"><img src="{pre}media/question.png" width="1468" height="1247" alt="{H(c['captions'][0])}" fetchpriority="high"></figure></section>
<section class="section" id="cards"><h2>{H(c['concept_title'])}</h2><p class="lead narrow">{H(c['concept'])}</p><div class="features">{articles(c['features'])}</div></section>
<section class="section preview" id="preview"><div><h2>{H(c['demo_title'])}</h2><p>{H(c['demo_note'])}</p><div class="preview-controls"><button type="button" id="sample-next">{H(c['next'])} →</button><span id="sample-count"></span></div></div><div class="sample-stage"><article class="sample-card" aria-live="polite"><span id="sample-energy"></span><p id="sample-question">{H(questions[0]['question'])}</p></article></div></section>
<section class="section energy"><div><h2>{H(c['energy_title'])}</h2><p class="lead">{H(c['energy_intro'])}</p><div class="energy-types">{articles(c['energy_items'])}</div></div><div class="energy-art"><img src="{pre}media/energy-shapes.png" alt="{'应用中的尖锐 Kiki 与圆润 Bouba 图形' if zh else 'The app’s pointed Kiki and rounded Bouba marks'}" width="252" height="125"><p class="small">{c['research']}</p></div></section>
<section class="section" id="use"><h2>{H(c['workflow_title'])}</h2><ol class="steps">{''.join('<li><h3>'+H(a)+'</h3><p>'+H(b)+'</p></li>' for a,b in c['steps'])}</ol></section>
<section class="section" id="screens"><h2>{H(c['gallery_title'])}</h2><div class="gallery">{gallery}</div><details><summary>{'播放卡片操作录像' if zh else 'Play a recorded card walkthrough'}</summary><img src="{pre}media/demo.gif" loading="lazy" alt="{'此前录制的真实卡片导航，播放速度经过调整' if zh else 'Previously recorded real card navigation, compressed and retimed'}"></details></section>
<section class="section runtime" id="start"><div><h2>{H(c['start_title'])}</h2><p>{H(c['start'])}</p><h3>{H(c['ai_title'])}</h3><p>{H(c['ai'])}</p></div><div><h3>{H(c['local'])}</h3><pre><code>npm ci\nnpm run dev</code></pre><p class="small">{H(c['local_note'])}</p><p><a href="{cfg['app_url'].rstrip('/')}/privacy/">{H(c['privacy'])}</a> / <a href="{cfg['app_url'].rstrip('/')}/support/">{H(c['support'])}</a></p><a href="https://github.com/{cfg['repository']}/blob/main/site/GUIDE.md">{H(c['guide'])} ↗</a></div></section></main>
<footer class="shell"><span>{H(c['footer'])}</span><a href="https://github.com/{cfg['repository']}">{H(c['source'])} ↗</a></footer><script id="question-data" type="application/json">{data}</script><script src="{pre}demo.js" defer></script></body></html>'''
  (dest/'index.html').write_text(page)
 print(out)
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--out',default='_site');a=ap.parse_args();build(Path(__file__).resolve().parents[1],Path(a.out).resolve())
