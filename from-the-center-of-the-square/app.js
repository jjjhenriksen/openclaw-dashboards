(function () {
  const data = window.SH_CORPUS_DATA;
  const format = new Intl.NumberFormat("en-US");
  const songs = data.songs || [];
  const books = Object.keys(data.books || {});
  const uniqueTexts = new Set(songs.map((song) => song.textKey).filter(Boolean)).size;
  const projectData = [
    { mark: "HS", icon: "🕯", iconLabel: "candle mark", eyebrow: "interactive fiction · corrected", title: "The Hollow Square", description: "A Sacred Harp horror game built around real tunes, shape-note sequences, cursed notes, silence, and the voice behind the square.", detail: "Eleven lessons use corrected fifteen-note tenor incipits; the artifact is undated, with later convention history kept distinct from 1844 framing.", status: "Playable artifact", accent: "green", source: "memory/2026-06-09.md · Hollow Square Historical and Musical Repair" },
    { mark: "A", icon: "◇", iconLabel: "four-shape atlas mark", eyebrow: "research interface · source fidelity", title: "The Shape-Note Atlas", description: "A living reader for tune and page lookup, edition context, notation, playback, transposition, and review status across a growing local corpus.", detail: "The local export currently indexes the evidence surface below; exact edition records, reference witnesses, and review-only material remain visibly distinct.", status: "Active build", accent: "gold", source: "portfolio-website/case-studies/the-shape-note-atlas.html" },
    { mark: "MLX", icon: "◎", iconLabel: "retrieval orbit mark", eyebrow: "local AI · grounded retrieval", title: "Sacred Harp Local AI", description: "A reproducible Apple Silicon LoRA pipeline for a small Sacred Harp reference model, paired with retrieval for exact corpus answers.", detail: "The verified working path is the MLX adapter plus RAG. Model-only generation remains limited for exact metadata and open-ended lyric synthesis.", status: "Trained · retrieval required", accent: "sage", source: "CPSC298-LocalLLM/sacred_harp_finetune/TRAINING_RECEIPT.md" }
  ];
  const els = { description: document.getElementById("hero-description"), projectCount: document.getElementById("hero-project-count"), corpusCount: document.getElementById("hero-corpus-count"), generated: document.getElementById("hero-generated"), projects: document.getElementById("project-grid"), metrics: document.getElementById("corpus-metrics"), trail: document.getElementById("evidence-trail") };
  function render() {
    const generated = new Date(data.generatedAt);
    els.description.textContent = "An overview of the active Sacred Harp projects: the artifacts, interfaces, and training work orbiting one source-conscious corpus.";
    els.projectCount.textContent = projectData.length + " active projects";
    els.corpusCount.textContent = format.format(songs.length) + " indexed records";
    els.generated.textContent = "Corpus export " + generated.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    els.projects.innerHTML = projectData.map((project, index) => '<article class="project-card project-card--' + project.accent + '" style="--project-index:' + index + '">' +
      '<div class="project-top"><span class="project-mark" aria-label="' + project.iconLabel + '"><span class="project-icon" aria-hidden="true">' + project.icon + '</span><span class="project-code">' + project.mark + '</span></span><span class="status-chip">' + project.status + '</span></div>' +
      '<p class="eyebrow">' + project.eyebrow + '</p><h2>' + project.title + '</h2><p class="project-description">' + project.description + '</p>' +
      '<div class="project-detail">' + project.detail + '</div><p class="project-source"><span>receipt</span> ' + project.source + '</p></article>').join("");
    const metrics = [["Indexed songs", format.format(songs.length), "display records in the local export"], ["Canonical texts", format.format(uniqueTexts), "text identities represented"], ["Book witnesses", format.format(books.length), "books represented in the export"], ["Corpus export", generated.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), "last generated timestamp"]];
    els.metrics.innerHTML = metrics.map(function ([label, value, note]) { return '<article class="metric"><div class="metric-label">' + label + '</div><div class="metric-value">' + value + '</div><div class="metric-note">' + note + '</div></article>'; }).join("");
    els.trail.innerHTML = projectData.map(function (project) { return '<div class="trail-row"><span class="trail-dot trail-dot--' + project.accent + '"></span><div><strong>' + project.title + '</strong><span>' + project.source + '</span></div><b>' + project.status + '</b></div>'; }).join("");
  }
  render();
})();