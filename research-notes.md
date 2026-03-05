# Research Notes: Visual Explanations of How LLMs Work

## Table of Contents
1. [Key Visual Patterns Found](#key-visual-patterns-found)
2. [Resource-by-Resource Analysis](#resource-by-resource-analysis)
3. [Best Diagram Styles by Concept](#best-diagram-styles-by-concept)
4. [Color Schemes and Layout Approaches](#color-schemes-and-layout-approaches)
5. [Key Quotes Worth Including](#key-quotes-worth-including)
6. [Historical Timeline](#historical-timeline)
7. [Screenshot Index](#screenshot-index)

---

## Key Visual Patterns Found

### Universal Patterns Across All Expert Explanations

1. **Progressive Disclosure**: Every expert starts with a black-box view, then zooms in layer by layer. Jay Alammar starts with "input sentence -> box -> output", then reveals encoder/decoder stacks, then individual layers, then the self-attention mechanism step by step. 3Blue1Brown does the same with the full GPT architecture.

2. **Flow Diagrams (Bottom-to-Top or Left-to-Right)**: Data flows upward through stacked layers in architecture diagrams. Processing steps flow left-to-right in mechanism explanations.

3. **Color-Coded Roles**: Consistent color assignment for different types of information:
   - Input/data in one color family
   - Weights/parameters in another
   - Outputs/predictions in a third
   - 3Blue1Brown: blue/red for weights, grey for data
   - Jay Alammar: distinct colors per attention head, per vector type (Q/K/V)

4. **Matrix Visualizations**: Embeddings and attention weights shown as colored grids/heatmaps. Red-white-blue or similar diverging color scales for values.

5. **Vector Arrows in Space**: Word embeddings shown as arrows in 2D/3D space to convey meaning-as-direction. Used universally for Word2Vec explanations.

6. **Dot Size = Magnitude**: Attention weights shown as dots of varying size in grid patterns (3Blue1Brown) or as color intensity in heatmaps.

7. **Side-by-Side Comparison**: Before/after, trained/untrained, different attention heads shown side by side for contrast.

8. **Animated Step-by-Step**: Complex operations broken into numbered sequential steps. Self-attention typically shown in 6 steps (embed -> Q,K,V -> dot product -> scale -> softmax -> weighted sum).

---

## Resource-by-Resource Analysis

### 1. Jay Alammar - "The Illustrated Transformer"
**URL**: http://jalammar.github.io/illustrated-transformer/
**Screenshots**: 01, 02

**Visual Approach**:
- Clean, vector-style illustrations with consistent color palette
- Each concept gets its own isolated diagram
- Diagrams use rounded rectangles for operations, arrows for data flow
- Color-coded vectors: Q (orange), K (orange variant), V (blue)
- Step-by-step buildup: first shows one attention head, then multi-head
- Positional encoding visualized as a colored stripe pattern (sine=one color, cosine=another)
- Matrix operations shown as literal box multiplication diagrams

**Key Diagrams**:
- Encoder-decoder stack (6 layers each, vertically stacked)
- Self-attention step-by-step (6 steps with numbers)
- Multi-head attention: 8 parallel pathways merging into one
- Positional encoding: 20x512 colored grid showing sine/cosine pattern
- Residual connections: arrows looping around processing blocks
- Softmax output: probability bars over vocabulary

**Best For**: The definitive reference for transformer internals. Every concept gets a clean, isolated diagram.

### 2. Jay Alammar - "The Illustrated Word2vec"
**URL**: https://jalammar.github.io/illustrated-word2vec/
**Screenshots**: 03

**Visual Approach**:
- Color-coded embedding matrices: red for positive, white for zero, blue for negative
- 2D scatter plots with arrows for vector arithmetic
- Sliding window animation for training data generation
- Skip-gram shown with green input word, pink context words
- Negative sampling as a table with 0/1 labels

**Key Diagrams**:
- King-Queen vector arithmetic with cosine similarity scores
- Embedding lookup as matrix row selection
- Training process: sliding window over text
- Two-matrix architecture (Embedding matrix + Context matrix)

### 3. 3Blue1Brown - Transformer/GPT Lessons
**URLs**: https://www.3blue1brown.com/lessons/gpt, https://www.3blue1brown.com/lessons/attention
**Screenshots**: 04, 05

**Visual Approach**:
- Signature 3B1B dark background with vibrant mathematical animations
- 3D space projections of high-dimensional embeddings (12,288 dims projected to 3D)
- Direction-as-meaning: vectors pointing in similar directions = similar meanings
- Dot product alignment shown geometrically (parallel = positive, perpendicular = zero, opposite = negative)
- Temperature effects on softmax shown as distribution shape changes
- Color distinction: blue/red for model weights, grey for data being processed

**Key Visual Innovations**:
- Word clusters in 3D projected space
- Gender direction as a consistent vector offset
- Attention as "what information should flow where"
- Each attention head as a different "question" being asked

**Key Quote**: "The weights are the actual brains of the model, learned during training."

### 4. Chris Olah's Blog
**URL**: https://colah.github.io/
**Screenshots**: 06, 07, 15, 31

**Visual Approach**:
- Clean, hand-drawn-style diagrams on white backgrounds
- LSTM cells shown as detailed circuit diagrams with gates
- Pink circles for pointwise operations, yellow boxes for learned layers
- Cell state as a "conveyor belt" -- horizontal line running through top of diagram
- Sigmoid gates shown with output values 0-1 controlling information flow
- t-SNE projections for embedding space visualization
- Manifold diagrams showing how neural networks warp space

**Key Diagrams**:
- LSTM cell with forget/input/output gates (the canonical visualization everyone references)
- Standard RNN (single tanh layer) vs LSTM (four interacting layers)
- Word embedding t-SNE maps showing semantic clusters
- Vector arithmetic: gender differences as constant difference vectors
- Bilingual embeddings: English and Chinese words overlapping in shared space
- Image embeddings mapped to word vector space

**Best For**: Making complex architectures feel intuitive through circuit-diagram metaphors.

### 5. Lilian Weng's Blog (Lil'Log)
**URL**: https://lilianweng.github.io/
**Screenshots**: 08, 24

**Visual Approach**:
- Academic-style diagrams with mathematical notation
- Comprehensive coverage with detailed annotations
- Clean flowcharts for model architectures
- Tables comparing different approaches

**Key Posts**:
- "The Transformer Family Version 2.0" (Jan 2023) - comprehensive 45-min read covering all transformer variants
- "Prompt Engineering" (Mar 2023) - in-context learning methods
- "LLM Powered Autonomous Agents" (Jun 2023) - planning, memory, tool use
- "Why We Think" (May 2025) - test-time compute and chain-of-thought

### 6. Transformer Circuits (Anthropic)
**URL**: https://transformer-circuits.pub/
**Screenshots**: 09, 16, 17, 22, 25

**Visual Approach**:
- Node-and-connection diagrams resembling neural circuit traces
- Feature activations shown as highlighted/dimmed nodes
- Interactive elements for exploring model internals
- Attribution graphs showing computation flow
- Superposition visualized through geometric diagrams

**Key Papers and Visual Concepts**:
- **Scaling Monosemanticity** (May 2024): Sparse autoencoder feature extraction from Claude 3 Sonnet
- **Golden Gate Claude**: Specific feature (Golden Gate Bridge) identified and amplified to 10x, causing model behavior changes
- **Toy Models of Superposition**: How neural networks "pack many unrelated concepts into a single neuron"
- **Biology of a Large Language Model**: Internal mechanisms across various contexts
- **Circuit Tracing**: Step-by-step computation tracing in model responses

### 7. Anthropic - Tracing Thoughts / Planning Ahead
**URL**: https://www.anthropic.com/research/tracing-thoughts-language-model
**Screenshots**: 10, 27, 28

**Visual Approach**:
- Three-panel comparison diagrams (natural planning vs suppressed vs injected)
- Activation flow diagrams showing feature interactions
- Multi-language shared feature visualizations

**Key Finding Visualized**:
- Poetry planning: Claude processes "grab it" and already identifies "rabbit" as rhyming endpoint, then writes backward from that target
- Three-panel diagram: (1) natural rhyme "rabbit", (2) suppressed concept forces "habit", (3) injected "green" forces different word
- Multi-language: overlapping activation patterns across English/French/Chinese
- Mental math: parallel pathways -- one for rough approximation, one for precise last digit
- Hallucination circuits: "known entity" feature activating for Michael Jordan but not for unknown "Michael Batkin"

**Best For**: Showing that LLMs are not just doing next-token prediction -- they plan ahead.

### 8. "Attention is All You Need" Paper
**URL**: https://arxiv.org/html/1706.03762v7
**Screenshots**: 12

**Visual Approach**:
- The original Figure 1 -- the canonical transformer architecture diagram
- Left half: encoder stack. Right half: decoder stack
- Each showing: Multi-Head Attention, Add & Norm, Feed Forward, Add & Norm
- Decoder has additional masked multi-head attention

**The Canonical Diagram Elements**:
- N=6 identical layers stacked
- Encoder: self-attention + feed-forward with residual connections
- Decoder: masked self-attention + encoder-decoder attention + feed-forward
- Positional encoding added to input embeddings
- Linear + Softmax at the top for output probabilities

### 9. Andrej Karpathy - "Let's Build GPT" / Visual Transformer
**URL**: https://karpathy.ai/zero-to-hero.html
**Screenshots**: 13, 18

**Visual Approach**:
- Minimalist, technical aesthetic with clean boxes and arrows
- Tensor dimensions annotated throughout (e.g., `(B,T,C)`)
- Color-coded components for different operations
- Hierarchical nesting showing module composition
- Maps diagrams directly to code

**Key Diagrams** (via Francesco Pochetti's visual interpretation):
1. GPTLanguageModel: token + position embeddings -> transformer blocks -> layer norm -> logits
2. Block: multi-head attention + feed-forward with residual connections
3. FeedForward: linear (expand 4x) -> ReLU -> linear (project back)
4. MultiHeadAttention: parallel heads concatenating through projection
5. Self-Attention: Q, K, V computation with masking and scaling
6. Step-by-step attention weight formation and value aggregation

**Best For**: Direct mapping from visual architecture to working code.

### 10. RLHF / InstructGPT Visualizations
**URLs**: https://huggingface.co/blog/rlhf, https://huyenchip.com/2023/05/02/rlhf.html
**Screenshots**: 11, 19, 26, 32

**Visual Approach**:
- Three-stage pipeline shown as sequential flow (left-to-right or top-to-bottom)
- Clear separation of models: policy, reward model, reference model
- Gradient vs no-gradient indicators on different model copies
- Comparative ranking UI mockups showing human annotation process

**The Three Stages Visualized**:
1. **Pretraining**: Massive data (trillions of tokens) -> base model
2. **Supervised Fine-Tuning (SFT)**: High-quality demonstrations -> instruction-following model
3. **RLHF/PPO**: Reward model from human preferences -> policy optimization

**Key Visual Elements**:
- Reward model: prompts -> LM generates multiple responses -> humans rank -> scalar reward signal
- PPO loop: policy generates text -> reward model scores -> KL penalty from reference model -> update policy
- Formula visualization: `r = r_theta - lambda * r_KL`
- Performance comparisons: InstructGPT (SFT + RLHF) vs SFT alone
- "Shoggoth with smiley face" meme as metaphor for RLHF alignment

**Best Quote**: "The pretrained model is an untamed monster" that gets progressively refined.

### Bonus: Transformer Explainer (Interactive)
**URL**: https://poloclub.github.io/transformer-explainer/
**Screenshots**: 14

- Browser-based live GPT-2 running via ONNX Runtime
- Interactive: type custom text, adjust temperature slider, configure top-k/top-p
- Hover over attention maps to see token relationships
- Built with Svelte + D3.js
- Shows full pipeline: embedding -> transformer blocks -> output probabilities

---

## Best Diagram Styles by Concept

### Word Embeddings / Vector Space
- **Best**: 2D/3D scatter plots with labeled word clusters (3Blue1Brown, Colah)
- **Style**: Dark background with bright colored dots/arrows
- **King-Queen arithmetic**: Show vectors as arrows, subtraction/addition geometrically
- **Color**: Use warm colors for one category, cool for another

### Tokenization / BPE
- **Best**: Step-by-step merge tables showing character pairs combining
- **Style**: Table format with highlighted merge operations
- **Interactive**: Sliding window over text showing token boundaries

### Self-Attention Mechanism
- **Best**: Jay Alammar's 6-step breakdown
- **Style**: Sequential numbered steps with intermediate values
- **Key elements**: Q/K/V vectors as colored columns, dot product as arrow connections, softmax as bar chart, weighted sum as final output
- **Alternative**: Grid/heatmap with dot size = attention weight (3Blue1Brown)

### Transformer Architecture (Full)
- **Best**: The original "Attention Is All You Need" Figure 1, enhanced by Jay Alammar
- **Style**: Vertical stack with labeled blocks, residual connections as side arrows
- **Key**: Show encoder and decoder side by side, clearly label each sub-layer

### Multi-Head Attention
- **Best**: Jay Alammar's parallel pathways diagram
- **Style**: 8 parallel streams merging through concatenation + projection
- **Key insight**: Different heads attend to different relationships (one head -> pronouns, another -> adjectives)

### RLHF Pipeline
- **Best**: HuggingFace's three-stage diagram
- **Style**: Left-to-right flow through three labeled boxes
- **Key**: Clearly distinguish which models have gradients and which are frozen
- **Human-in-the-loop**: Show ranking interface with multiple responses

### Positional Encoding
- **Best**: Jay Alammar's sine/cosine stripe pattern
- **Style**: 2D grid colored by value, split down middle (sine left, cosine right)

### LSTM / RNN Gates
- **Best**: Colah's circuit-diagram style
- **Style**: Gates as sigma symbols with data flow lines, pink operations, yellow learned layers
- **Metaphor**: Cell state as conveyor belt

### Next Token Prediction
- **Best**: Probability bar chart over vocabulary
- **Style**: Show top-k tokens with probability bars, temperature effect on distribution shape
- **Key**: Autoregressive loop -- output feeds back as input

### Mechanistic Interpretability
- **Best**: Anthropic's attribution graphs and circuit tracing
- **Style**: Node-and-connection diagrams with activation highlighting
- **Key examples**: Poetry planning (three-panel), Golden Gate Bridge feature

---

## Color Schemes and Layout Approaches

### Color Palettes That Work Well

| Source | Background | Primary Colors | Approach |
|--------|-----------|----------------|----------|
| 3Blue1Brown | Dark navy/black (#1a1a2e) | Bright blue, yellow, green, pink | High contrast on dark bg |
| Jay Alammar | White/light grey | Orange, blue, green, purple | Clean on light bg |
| Colah | White | Pink (operations), yellow (layers), blue/green (data) | Functional color coding |
| Transformer Circuits | White | Blue nodes, orange highlights | Academic clean |
| HuggingFace RLHF | White | Blue, orange, green (one per stage) | Sequential color coding |

### Layout Principles

1. **Vertical stacking** for layer hierarchy (encoder/decoder stacks)
2. **Horizontal flow** for sequential processing steps
3. **Parallel tracks** for multi-head attention
4. **Nesting/zoom** for progressive detail (architecture -> block -> mechanism)
5. **Grid/matrix** for attention patterns and embeddings
6. **Arrows with labels** for data transformation (input dims -> output dims)

### Typography in Diagrams
- Sans-serif fonts for labels
- Monospace for tensor dimensions and code
- Mathematical notation (sigma, softmax formulas) kept minimal but precise
- Consistent font sizes: larger for component names, smaller for annotations

---

## Key Quotes Worth Including

### On What LLMs Actually Do
- "Self-attention allows it to associate 'it' with 'animal'" -- Jay Alammar
- "The weights are the actual brains of the model, learned during training" -- 3Blue1Brown
- "Word in each position flows through its own path in the encoder" -- Jay Alammar
- "Neural networks often seem to pack many unrelated concepts into a single neuron" -- Anthropic (Superposition)

### On Attention
- "Softmax score determines how much each word will be expressed at this position" -- Jay Alammar
- "Model's ability to focus on different positions" -- Jay Alammar (multi-head benefit)
- "Masking future positions (setting them to -inf) before the softmax step" -- Jay Alammar (causal)

### On Word Embeddings
- "One direction in this space encodes gender information" -- 3Blue1Brown
- "Gender differences tend to end up being represented with a constant difference vector" -- Colah
- "Every position gets a little bit of probability even if it's unlikely" -- Jay Alammar

### On Training / RLHF
- "The pretrained model is an untamed monster" -- Chip Huyen
- "It's easier to say 'this one is better' than give absolute scores" -- HuggingFace RLHF

### On Planning / Reasoning
- "The model plans its outputs ahead of time when writing lines of poetry" -- Anthropic
- Claude identifies "rabbit" as rhyming word while processing "grab it", then writes backward to reach it -- Anthropic
- "One path computes a rough approximation of the answer and the other focuses on precisely determining the last digit" -- Anthropic (mental math)

### On Interpretability
- First ever detailed look inside a modern, production-grade large language model -- Anthropic (re: Golden Gate Claude)
- "Languages having similar shape that align when forced to correspond at known translation points" -- Colah (bilingual embeddings)

---

## Historical Timeline of Key Developments

| Year | Development | Key Visual/Paper |
|------|-------------|-----------------|
| 2013 | Word2Vec (Mikolov et al.) | King-Queen vector arithmetic |
| 2014 | GloVe word embeddings | Co-occurrence matrix factorization |
| 2014 | Seq2Seq with Attention (Bahdanau) | First attention mechanism for NLP |
| 2015 | Colah's LSTM blog post | Canonical LSTM gate diagrams |
| 2017 | "Attention Is All You Need" (Vaswani et al.) | The transformer architecture (Figure 1) |
| 2018 | GPT-1 (OpenAI) | Decoder-only transformer for language |
| 2018 | BERT (Google) | Encoder-only transformer, bidirectional |
| 2019 | GPT-2 (OpenAI) | Scaling up decoder-only transformers |
| 2020 | GPT-3 (OpenAI) | 175B parameters, few-shot learning |
| 2021 | Transformer Circuits framework (Anthropic) | Mathematical framework for reverse-engineering |
| 2022 | InstructGPT / RLHF (OpenAI) | Three-stage training pipeline |
| 2022 | ChatGPT launch | Consumer-facing LLM |
| 2022 | Toy Models of Superposition (Anthropic) | How features pack into neurons |
| 2023 | Jay Alammar's Illustrated Transformer | Definitive visual guide |
| 2023 | Andrej Karpathy "Let's Build GPT" | Code-to-diagram mapping |
| 2023 | 3Blue1Brown Deep Learning series | Mathematical animation of transformers |
| 2023 | Towards Monosemanticity (Anthropic) | Sparse autoencoder features |
| 2024 | Scaling Monosemanticity / Golden Gate Claude | Feature identification in production models |
| 2024 | Claude 3 / GPT-4 era | Multimodal, reasoning capabilities |
| 2025 | Circuit Tracing / Biology of LLM (Anthropic) | Planning ahead, attribution graphs |
| 2025 | Reasoning models (o1, Claude thinking) | Test-time compute, chain-of-thought |

---

## Screenshot Index

All screenshots saved to: `research-screenshots/`

| # | File | Content | Source |
|---|------|---------|--------|
| 01 | `01-illustrated-transformer-full.png` | Jay Alammar Illustrated Transformer (top) | jalammar.github.io |
| 02 | `02-illustrated-transformer-attention.png` | Illustrated Transformer (full page scroll) | jalammar.github.io |
| 03 | `03-illustrated-word2vec-full.png` | Illustrated Word2Vec (full page) | jalammar.github.io |
| 04 | `04-3blue1brown-gpt.png` | 3Blue1Brown GPT lesson | 3blue1brown.com |
| 05 | `05-3blue1brown-attention.png` | 3Blue1Brown Attention lesson | 3blue1brown.com |
| 06 | `06-colah-lstm.png` | Colah's Understanding LSTMs | colah.github.io |
| 07 | `07-colah-blog-main.png` | Colah's blog main page | colah.github.io |
| 08 | `08-lilianweng-transformer-family.png` | Lilian Weng Transformer Family v2 | lilianweng.github.io |
| 09 | `09-transformer-circuits-main.png` | Transformer Circuits main page | transformer-circuits.pub |
| 10 | `10-anthropic-tracing-thoughts.png` | Anthropic Tracing Thoughts research | anthropic.com |
| 11 | `11-huggingface-rlhf.png` | HuggingFace RLHF blog post | huggingface.co |
| 12 | `12-attention-paper-arxiv.png` | "Attention Is All You Need" paper | arxiv.org |
| 13 | `13-karpathy-visual-transformer.png` | Karpathy visual transformer deep dive | francescopochetti.com |
| 14 | `14-transformer-explainer.png` | Transformer Explainer interactive tool | poloclub.github.io |
| 15 | `15-colah-word-embeddings.png` | Colah's NLP Representations post | colah.github.io |
| 16 | `16-scaling-monosemanticity.png` | Scaling Monosemanticity (Anthropic) | transformer-circuits.pub |
| 17 | `17-anthropic-biology-llm.png` | Biology of a Large Language Model | transformer-circuits.pub |
| 18 | `18-karpathy-zero-to-hero.png` | Karpathy Zero to Hero course | karpathy.ai |
| 19 | `19-huyenchip-rlhf.png` | Chip Huyen RLHF article | huyenchip.com |
| 20 | `20-visual-transformer-guide.png` | Hendrik Erz Visual Transformer Guide | hendrik-erz.de |
| 21 | `21-openai-instructgpt.png` | OpenAI InstructGPT page | openai.com |
| 22 | `22-toy-models-superposition.png` | Toy Models of Superposition | transformer-circuits.pub |
| 23 | `23-word-embedding-demo.png` | CMU Word Embedding Demo | cs.cmu.edu |
| 24 | `24-lilianweng-prompt-engineering.png` | Lilian Weng Prompt Engineering | lilianweng.github.io |
| 25 | `25-circuit-tracing-methods.png` | Circuit Tracing Methods paper | transformer-circuits.pub |
| 26 | `26-raschka-rlhf-alternatives.png` | Sebastian Raschka RLHF alternatives | sebastianraschka.com |
| 27 | `27-golden-gate-claude.png` | Golden Gate Claude announcement | anthropic.com |
| 28 | `28-anthropic-mapping-mind.png` | Mapping the Mind of a Language Model | anthropic.com |
| 29 | `29-bpe-tokenization.png` | BPE Tokenization (HuggingFace) | huggingface.co |
| 30 | `30-next-token-prediction.png` | Next Token Prediction with GPT | huggingface.co |
| 31 | `31-colah-visualizing-representations.png` | Colah's Visualizing Representations | colah.github.io |
| 32 | `32-instructgpt-rlhf-guide.png` | InstructGPT RLHF Interactive Guide | mbrenndoerfer.com |

---

## Recommended Presentation Flow (Based on Research)

For a presentation explaining "How LLMs Work", the visual research suggests this progression:

1. **Words as Numbers** (Word Embeddings)
   - Vector space with word clusters
   - King-Queen arithmetic
   - "Direction = Meaning" metaphor

2. **Reading All Words at Once** (Attention)
   - Self-attention as "which words are relevant to each other"
   - Q/K/V as "question/answer/information"
   - Multi-head = multiple perspectives simultaneously

3. **The Architecture** (Transformer)
   - Progressive zoom: full model -> block -> mechanism
   - Encoder-decoder vs decoder-only
   - Residual connections as "information highways"

4. **Training** (Pretraining + RLHF)
   - Next token prediction on massive text
   - Three-stage RLHF pipeline
   - "Untamed monster" -> "helpful assistant"

5. **What's Inside** (Interpretability)
   - Features/neurons visualization
   - Golden Gate Claude example
   - Planning ahead in poetry
   - Circuit tracing

6. **Generation** (Inference)
   - Autoregressive loop
   - Temperature and sampling
   - Probability distributions over vocabulary
