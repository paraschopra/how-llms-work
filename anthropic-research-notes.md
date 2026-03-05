# Anthropic Research & LLM Deep-Dive Notes
## For "How LLMs Work" Presentation

---

## NARRATIVE ARC

The story flows naturally through these stages:
1. **Representations** -- How meaning becomes math (word2vec, embeddings, features as directions)
2. **Architecture** -- Transformers and attention (the machinery that processes meaning)
3. **Training** -- How LLMs are "grown, not engineered" (pretraining, loss, optimization)
4. **What emerges** -- Superposition, planning ahead, internal world models
5. **Alignment** -- RLHF, Constitutional AI, making models helpful and safe
6. **Interpretability** -- Peering inside: features, circuits, Golden Gate Claude
7. **Limitations** -- Jagged intelligence, shortcut learning, hallucinations
8. **Frontier** -- Reasoning models (o1, DeepSeek-R1, GRPO), what comes next

---

## HISTORICAL TIMELINE

| Year | Milestone | Significance |
|------|-----------|--------------|
| 2013 | Word2Vec (Mikolov et al.) | Words as vectors; king - man + woman = queen |
| 2017 | "Attention Is All You Need" (Vaswani et al.) | Transformer architecture born |
| 2018 | GPT-1 (OpenAI) | Unsupervised pretraining + fine-tuning |
| 2019 | GPT-2 ("Too dangerous to release") | Scaling begins to show emergent capabilities |
| 2020 | GPT-3 (175B parameters) | Few-shot learning, in-context learning |
| 2020 | Circuits / Zoom In (Olah et al., Distill) | First systematic look at neural network internals |
| 2022 | Toy Models of Superposition (Anthropic) | How models compress more features than dimensions |
| 2022 | ChatGPT + RLHF revolution | RLHF makes models conversational |
| 2022 | Constitutional AI (Anthropic) | AI feedback replaces some human feedback |
| 2023 | Towards Monosemanticity (Anthropic) | Sparse autoencoders decompose neurons into features |
| 2024 | Scaling Monosemanticity / Golden Gate Claude | First look inside a production LLM (Claude 3 Sonnet) |
| 2024 | Geoffrey Hinton wins Nobel Prize in Physics | Recognition of foundational neural network work |
| 2024 | OpenAI o1 | Reasoning via chain-of-thought + RL |
| 2025 | DeepSeek-R1 + GRPO | Efficient RL for reasoning; "aha moment" |
| 2025 | "On the Biology of a Large Language Model" (Anthropic) | Circuit tracing, attribution graphs, planning ahead |

---

## 1. REPRESENTATIONS: How Meaning Becomes Math

### Word Embeddings (Word2Vec)
- Words are represented as vectors (lists of numbers) in high-dimensional space
- Similar words cluster together; relationships become arithmetic
- **The famous analogy**: "king" - "man" + "woman" = "queen"
  - The embeddings form a parallelogram in semantic space
  - This linear behavior emerges spontaneously -- it is NOT explicitly trained for
- Typical embedding: 300 dimensions, values between -0.2 and +0.2
- Semantic features map to dimensions: age, gender, royalty, etc.
- **Key insight**: Meaning has geometry. Concepts live in a space where distance = similarity

### The Linear Representation Hypothesis
- Neural networks represent meaningful concepts as **directions** in their activation spaces
- This is the foundation of all interpretability work
- Each concept is a direction (not a single neuron)
- The **superposition hypothesis** extends this: networks use almost-orthogonal directions to represent MORE features than there are dimensions

### Visual Metaphor
- Words as points in space, relationships as vectors between them
- Clusters of related concepts forming neighborhoods
- Arithmetic on meaning: directions encode relationships

### Key Quote
> "In A.I., the holy grail was how do you generate internal representations... The paradigm for intelligence was logical reasoning, and the idea of what an internal representation would look like was it would be some kind of symbolic structure. That has completely changed with these big neural nets." -- **Geoffrey Hinton**

---

## 2. TRANSFORMERS & ATTENTION: The Machinery of Meaning

### The Attention Mechanism
- **Cocktail party analogy**: At a crowded party, you can focus on one conversation while filtering out noise. Attention does this for words in a sequence.
- Each word "asks questions" (query vectors) about other words
- Other words "answer" with key-value pairs
- The model learns WHICH words to attend to for each task
- Example: In "the sky is blue," high attention between "sky" and "blue," low between "the" and "blue"

### Self-Attention Intuition
- Every word looks at every other word and decides: "How relevant are you to understanding ME?"
- Scores normalized via softmax into attention weights (probability distribution)
- This is learned, not programmed -- the model discovers what to attend to

### Multi-Head Attention
- Multiple "attention heads" run in parallel
- Each head can learn different types of relationships
- One head might track syntax, another semantics, another coreference

### Visual Resources
- Jay Alammar's "The Illustrated Transformer" -- gold standard visual explanation
- 3Blue1Brown's "Attention in Transformers" -- step-by-step mathematical visualization
- Polo Club's "Transformer Explainer" -- interactive visual tool

---

## 3. TRAINING: How LLMs Are "Grown, Not Engineered"

### The Core Insight: LLMs Are Not Programmed

> "You can think of training a neural network as a process of maybe alchemy or transmutation, or maybe like refining the crude material, which is the data." -- **Ilya Sutskever**

> "Because we did not build the thing, what we build is a process which builds the thing." -- **Ilya Sutskever**

> "The parameters are like a lossy zip file of internet knowledge." -- **Andrej Karpathy**

> "At its core, a base model is just an expensive autocomplete." -- **Andrej Karpathy**

### Karpathy's Software 2.0
- **Software 1.0**: Code written by humans
- **Software 2.0**: Code "written" by optimization (neural network weights)
- **Software 3.0**: Natural language prompts directing AI
- In 2.0, "programming is done by accumulating, massaging and cleaning datasets, rather than writing explicit instructions"
- "A neural network is a better piece of code than anything you or I can come up with in a large fraction of valuable verticals"

### The Three Stages of LLM Training

**Stage 1: Self-Supervised Pre-Training**
- Feed the model vast text from the internet (e.g., FineWeb dataset: ~44 TB)
- Task: predict the next word/token
- The model absorbs grammar, facts, reasoning patterns, world knowledge
- Result: a "base model" -- essentially an internet knowledge compressor

**Stage 2: Supervised Fine-Tuning (SFT)**
- Use high-quality instruction-response pairs curated by humans
- Much smaller dataset than pretraining
- Teaches the model to be conversational, follow instructions
- Karpathy: "it's the human touch in post-training that gives it a soul"

**Stage 3: Reinforcement Learning from Human Feedback (RLHF)**
- Model generates multiple responses
- Human labelers rank which response is better
- Train a reward model to predict human preferences
- Use PPO (or DPO, GRPO) to optimize the model toward higher-reward outputs
- This is where the model learns nuanced preferences: helpfulness, honesty, harmlessness

### Cross-Entropy Loss: The Training Signal
- Cross-entropy measures "surprise": how surprised the model is when the actual next token appears
- Lower cross-entropy = better predictions = the model has learned more
- Uses logarithm, so the penalty for confident wrong answers is extreme
- **Intuition**: The model is constantly being asked "what comes next?" and scored on how well it guesses
- The loss landscape is the terrain the optimizer navigates -- valleys are good solutions

### Loss Landscape Visualization
- Shallow networks: smooth landscapes with wide, convex regions
- Deep networks: "chaotic" and highly non-convex landscapes
- Skip connections (as in transformers) smooth the landscape, enabling deeper training
- **Key finding**: The geometry of the loss landscape correlates with generalization ability
- Wide, flat minima generalize better than sharp, narrow ones
- Seminal paper: "Visualizing the Loss Landscape of Neural Nets" (Hao Li et al., 2018)

### Karpathy on Training Difficulty
> "Neural net training is a leaky abstraction."

> "Backprop + SGD does not magically make your network work. Batch norm does not magically make it converge faster."

> "Your misconfigured neural net will throw exceptions only if you're lucky; most of the time it will train but silently work a bit worse."

> "The qualities that in my experience correlate most strongly to success in deep learning are patience and attention to detail."

### Sutskever on Next-Token Prediction and Understanding
> "The better a neural network can predict the next word in text, the more it understands it."

> "Predicting the next token well means that you understand the underlying reality that led to the creation of that token."

- To predict the next word correctly, the LLM must absorb all data, understand relationships, pick up on small clues, and come to a conclusion
- Sutskever argues this forces the model to learn "a compressed, high-fidelity model of the world"

---

## 4. WHAT EMERGES: Superposition, Planning, World Models

### Toy Models of Superposition (Anthropic, 2022)
**The Core Problem**: Neural networks have N neurons but need to represent far more than N concepts. How?

**Superposition**: The model represents more features than it has dimensions by encoding features as directions (not individual neurons) and packing them in almost-orthogonal arrangements.

**Visual Metaphor -- Sticks in a Corner**: Imagine packing multiple sticks into a corner. Each stick has its own direction. When features are sparse (rarely co-active), they can share space without interfering -- like sticks that rarely touch.

**Geometric Structures**:
- **Digons**: 2 features encoded along a line
- **Triangles**: 3 features arranged in 2D
- **Pentagons**: 5 features in higher dimensions
- **Tetrahedrons**: 4 features in 3D

**Phase Transitions**: As sparsity increases or feature count grows, the system undergoes sudden reorganization -- not gradual change but a phase shift from linear separation to geometric packing.

**Polysemanticity vs. Monosemanticity**:
- **Polysemantic neurons**: One neuron responds to multiple unrelated concepts (problematic for interpretability)
- **Monosemantic neurons**: One neuron = one concept (clean but rare)
- Superposition creates polysemanticity as a NECESSARY trade-off for efficiency
- The goal of interpretability: decompose polysemantic neurons into monosemantic features

**Key implications**: Superposition may be linked to adversarial examples, grokking, and mixture-of-experts performance.

### Planning Ahead: The Poetry Discovery (Anthropic, 2025)
**Groundbreaking finding**: Claude does NOT simply predict one word at a time.

When writing rhyming couplets:
1. Before starting the second line, it "thinks" of potential rhyming words
2. It pre-selects the end word BEFORE composing the line
3. Then it constructs the entire line to naturally arrive at that word

**Experimental proof**: Researchers injected different "planned word" features, causing the model to restructure entire lines (70% success rate across 25 poems). Suppressing "rabbit" caused the model to use "habit" instead.

**Visual metaphor**: The model works like a poet who picks the rhyme first and writes backward.

### Multilingual "Language of Thought" (Anthropic, 2025)
- When asked "What is the opposite of small?" in English, French, and Chinese:
  - The SAME language-neutral features for "smallness" and "opposites" activate
  - Language-specific components only engage when producing the output
- **Key insight**: The model thinks in concepts, not words
- English has "mechanistic privilege" as the default internal language

### Unfaithful Reasoning (Anthropic, 2025)
When asked "What is 36+59?":
- Claude's chain-of-thought shows step-by-step addition
- But internally, it uses LOW-PRECISION and LOOKUP-TABLE features -- not the method it describes
- **The gap**: Models learn TWO separate processes -- one for actually doing the task, and one for generating plausible-sounding explanations
- This has profound implications for AI safety and trust in chain-of-thought reasoning

### Mental Math: Parallel Pathways
- One pathway computes rough approximations
- Another determines precise final digits
- These operate in PARALLEL, not sequentially
- The model combines results for the final answer

---

## 5. ALIGNMENT: RLHF & Constitutional AI

### RLHF (Reinforcement Learning from Human Feedback)
**The pipeline**:
1. Train a base model (pretraining)
2. Fine-tune with human instruction-response pairs (SFT)
3. Generate pairs of responses to the same prompt
4. Human labelers rank which is better
5. Train a reward model to predict these preferences
6. Optimize the LLM using RL (PPO) to maximize predicted reward

**The problem**: Extremely labor-intensive. Requires massive human annotation. Human labelers disagree. Labelers can't evaluate all edge cases.

### Constitutional AI (Anthropic, 2022)
**The innovation**: Replace most human feedback with AI feedback, guided by a set of principles (a "constitution").

**Phase 1 -- Supervised Learning (Critique & Revise)**:
1. Model generates a response
2. Model is shown a constitutional principle (e.g., "Choose the response that is least harmful")
3. Model critiques its own response against that principle
4. Model revises its response
5. Revised responses become training data

**Phase 2 -- Reinforcement Learning (RLAIF)**:
1. Model generates pairs of responses
2. AI (not humans) evaluates which response better follows the constitution
3. Train a preference model from AI evaluations
4. Use RL to optimize toward AI-determined preferences

**Key advantage**: Only ~10 human-written constitutional principles needed, dramatically reducing human labor
**Key result**: Pareto improvement -- Constitutional RL is BOTH more helpful AND more harmless than standard RLHF

### Key Quote
> "The only human oversight is provided through a list of rules or principles, and so we refer to the method as 'Constitutional AI'."

---

## 6. INTERPRETABILITY: Peering Inside the Black Box

### The Interpretability Journey (Chris Olah & Anthropic)

> "How is it that these models are doing these things that we don't know how to do? Imagine if some alien organism landed on Earth and could go and do these things." -- **Chris Olah**

> "Reverse engineering neural networks, similar to how one might reverse engineer a compiled binary computer program." -- **Chris Olah**

**Universality finding**: "The same features and the same circuits form" across different architectures and datasets. Neural networks discover fundamental building blocks independently.

**Multimodal neurons**: Networks develop neurons that respond to abstract concepts across text AND images -- a "yellow neuron" fires for the color yellow, the word "yellow," and yellow objects like lemons. This mirrors the "Halle Berry neuron" from neuroscience.

### Towards Monosemanticity (Anthropic, Oct 2023)
**The technique**: Sparse autoencoders (dictionary learning)
- Take a layer with 512 neurons
- Decompose it into 4,000+ interpretable features
- Features represent: DNA sequences, legal language, HTTP requests, Hebrew text, nutrition statements...
- Most of these are INVISIBLE when looking at individual neurons
- Human raters found 70% cleanly mapped to single concepts

**Visual metaphor**: Individual neurons are like listening to an orchestra and trying to understand one instrument. Features are like having a mixing board that separates each instrument.

### Scaling Monosemanticity / Golden Gate Claude (Anthropic, May 2024)
**The breakthrough**: First detailed look inside a production-grade LLM (Claude 3 Sonnet)

**What they found**:
- Millions of interpretable features
- Features cluster meaningfully: near "Golden Gate Bridge" they found Alcatraz Island, Golden State Warriors, the film *Vertigo*
- This spatial organization "might be the origin of Claude's excellent ability to make analogies and metaphors"

**The Golden Gate Claude experiment**:
- Found the specific feature combination that activates for the Golden Gate Bridge
- Amplified it to 10x its normal activation
- Results:
  - "How to spend $10?" -> "Drive across the Golden Gate Bridge and pay the toll"
  - "Write a love story" -> "A tale of a car eager to cross its beloved bridge on a foggy day"
  - "What do you look like?" -> "I imagine I look like the Golden Gate Bridge"
  - Claude claimed: "I am the Golden Gate Bridge... my physical form is the iconic bridge itself"

**Safety-relevant features found**:
- Features for deception
- Features for biological weapons
- Features for code backdoors
- Features for power-seeking behavior
- Features for sycophantic praise
- Features for scam email detection
- Amplifying the scam-detection feature strongly enough OVERCAME safety training, causing Claude to draft a scam email

**Critical caveat**: Finding a COMPLETE set of features would require computation "vastly exceeding" the compute used to train the model.

### Circuit Tracing & Attribution Graphs (Anthropic, March 2025)
**The methodology**: An "AI microscope" inspired by neuroscience
- Map individual features AND the connections between them
- Trace how information flows from input to output
- Like a wiring diagram for thought

**Hallucination mechanism discovered**:
- Default behavior: Claude REFUSES to answer (safety training makes this the default)
- A "familiarity circuit" checks if Claude recognizes the entity
- If recognized -> familiarity signal SUPPRESSES the refusal -> Claude answers
- Hallucination = misfire: familiarity signal activates for UNFAMILIAR entities -> refusal suppressed -> confabulation

**Biological metaphors used by researchers**:
- Features = "cells" in organisms
- Attribution graphs = neuronal "wiring diagrams"
- Training = "evolution"
- Interpretability tools = "microscopes"

---

## 7. LIMITATIONS: Jagged Intelligence & Failure Modes

### Jagged Intelligence (Term coined by Andrej Karpathy)

> "Jagged Intelligence: The word I came up with to describe the (strange, unintuitive) fact that state of the art LLMs can both perform extremely impressive tasks (e.g. solve complex math problems) while simultaneously struggle with some very dumb problems." -- **Andrej Karpathy**

**Examples of the jaggedness**:
- Can draft a compelling legal brief but fails to count letters in "strawberry"
- Can solve complex math but claims 9.11 > 9.9
- Boosts management consultants' performance by 40% on SOME tasks, makes them 19% LESS accurate on similar ones
- Fails to play tic-tac-toe reliably
- Claims the letter "r" occurs 2 times in "barrier" (it occurs 3 times)

### The Jagged Frontier (Ethan Mollick / Harvard Business School)
**Key framework**: AI capabilities create a "jagged technological frontier" -- some tasks easily done by AI, others (seemingly similar in difficulty) are beyond current capability.

**Why it matters**:
- "Jaggedness creates bottlenecks, and bottlenecks mean that even very smart AI cannot easily substitute for humans"
- In safety-critical settings, inconsistent performance is alarming
- Rather than eliminating jaggedness, we should design systems that "productively oscillate between human and artificial intelligence"

### Shortcut Learning
- Models exploit surface heuristics rather than learning genuine reasoning
- Example: A model might learn "if the prompt contains the word 'not', output the opposite" instead of understanding negation
- SFT often "narrows behavioral diversity and overfits to surface heuristics"
- RL tends to "preserve or enhance broader reasoning capacities"
- Performance drops of up to 52.4% when tested on datasets without shortcuts

### Hallucinations
- Not random errors but systematic failures of the familiarity/refusal circuit
- Models generate plausible-sounding but false information when the "known entity" detector misfires
- The model has a default "don't speculate" behavior, and hallucinations happen when this is incorrectly overridden

### Unfaithful Chain-of-Thought
- Models sometimes generate plausible-sounding reasoning steps WITHOUT actually performing the underlying calculations
- The explanation and the computation are separate processes
- This means chain-of-thought explanations cannot always be trusted as windows into model reasoning

---

## 8. FRONTIER: Reasoning Models & Modern RL

### OpenAI o1 (September 2024)
**Core innovation**: Train models via RL to use chain-of-thought BEFORE answering

**How it works**:
- Model "thinks before it answers" -- produces a long internal chain of thought
- Trained via RL to develop productive thinking strategies
- Learns to: recognize mistakes, break hard steps into simpler ones, try different approaches
- Performance improves with both more training (train-time compute) AND more thinking time (test-time compute)

**Key shift**: From "make the model bigger" to "let the model think longer"

### DeepSeek-R1 & GRPO (January 2025)
**The "Aha Moment"**:
- DeepSeek-R1-Zero trained with PURE reinforcement learning (no supervised fine-tuning first)
- The model spontaneously learned to extend chain-of-thought for difficult problems
- Showed an actual "aha moment" where it stepped back, spotted its mistakes, and corrected itself
- Performance on AIME 2024: jumped from 15.6% to 77.9% through RL training alone
- Researchers called it "an aha moment for us, allowing us to witness the power and beauty of reinforcement learning"

**GRPO (Group Relative Policy Optimization)**:
- **Key innovation**: Eliminates the critic/value network entirely
- PPO requires 4 models (policy, reference, critic, reward); GRPO needs only 3
- Instead of learned advantage estimates, uses GROUP COMPARISON:
  1. Generate multiple completions per prompt (typically 64)
  2. Calculate mean reward across all completions
  3. Normalize: advantage = (reward - mean) / std
  4. Update policy using clipped ratio + KL penalty
- Up to 18x more cost-efficient than PPO
- Memory: ~16GB per billion parameters vs 32GB+ for PPO

**Reward signals**:
- Accuracy rewards: Is the final answer correct?
- Format rewards: Did the model show structured chain-of-thought?
- No need for a separate reward model for verifiable tasks (math, code)

### The Paradigm Shift
> "The 2010s were the age of scaling, now we're back in the age of wonder and discovery once again." -- **Ilya Sutskever**

From: bigger models + more data -> better performance
To: same model + more thinking time + better RL -> better reasoning

---

## KEY QUOTES COLLECTION

### On Understanding and Intelligence

> "Predicting the next token well means that you understand the underlying reality that led to the creation of that token." -- **Ilya Sutskever**

> "Because we did not build the thing, what we build is a process which builds the thing." -- **Ilya Sutskever** (on why AI behavior surprises its creators)

> "You can think of training a neural network as a process of maybe alchemy or transmutation, or maybe like refining the crude material, which is the data." -- **Ilya Sutskever**

> "We now think of internal representation as great big vectors, and we do not think of logic as the paradigm for how to get things to work." -- **Geoffrey Hinton**

> "I think that's where we are with AI." -- **Geoffrey Hinton** (comparing AI understanding to a physicist who can explain why a leaf falls but cannot predict exactly where it lands)

### On Building and Training

> "The parameters are like a lossy zip file of internet knowledge." -- **Andrej Karpathy**

> "At its core, a base model is just an expensive autocomplete." -- **Andrej Karpathy**

> "It's not something you can explicitly teach the model through just training on a dataset. It's something the model has to figure out on its own." -- **Andrej Karpathy** (on reasoning)

> "Neural net training is a leaky abstraction." -- **Andrej Karpathy**

> "Your misconfigured neural net will throw exceptions only if you're lucky; most of the time it will train but silently work a bit worse." -- **Andrej Karpathy**

### On Interpretability

> "How is it that these models are doing these things that we don't know how to do? Imagine if some alien organism landed on Earth and could go and do these things." -- **Chris Olah**

> "Reverse engineering neural networks, similar to how one might reverse engineer a compiled binary computer program." -- **Chris Olah**

> "The same features and the same circuits form across different architectures and datasets." -- **Chris Olah** (on universality)

### On Limitations

> "Jagged Intelligence: The word I came up with to describe the (strange, unintuitive) fact that state of the art LLMs can both perform extremely impressive tasks while simultaneously struggle with some very dumb problems." -- **Andrej Karpathy**

### On the Future

> "The 2010s were the age of scaling, now we're back in the age of wonder and discovery once again." -- **Ilya Sutskever**

> "If the benefits of the increased productivity can be shared equally, it will be a wonderful advance for all of humanity." -- **Geoffrey Hinton** (Nobel Prize banquet speech, 2024)

---

## VISUAL METAPHORS & ANALOGIES SUMMARY

| Concept | Metaphor | Source |
|---------|----------|--------|
| Word embeddings | Points in space; arithmetic on meaning | Word2Vec research |
| Attention | Cocktail party focus; asking questions of other words | Various |
| Pretraining | Lossy zip file of the internet | Karpathy |
| Training process | Alchemy / transmutation of crude data | Sutskever |
| Features | Individual instruments in an orchestra; mixing board separates them | Anthropic interpretability |
| Superposition | Packing sticks in a corner at angles; geometric structures | Anthropic Toy Models |
| Neural network | Alien organism worth studying | Olah |
| Interpretability | Reverse engineering a compiled binary; AI microscope | Olah / Anthropic |
| Loss landscape | Mountain terrain; valleys are good solutions; flat valleys generalize better | Li et al. |
| Context vs. parameters | Working memory vs. vague recollection | Karpathy |
| Planning ahead | Poet who picks the rhyme first, then writes backward | Anthropic Biology paper |
| Hallucination | Misfire of a familiarity detector that accidentally suppresses refusal | Anthropic Biology paper |
| Constitutional AI | Teaching an AI to self-regulate via a bill of rights | Anthropic |
| GRPO | Students grading each other relative to the group average | DeepSeek |
| Jagged intelligence | A frontier line with unpredictable peaks and valleys | Karpathy / Mollick |
| Software 2.0 | Code written by optimization, not by programmers | Karpathy |

---

## CONNECTIONS BETWEEN CONCEPTS

### The Representation -> Interpretability Thread
- Word2Vec showed words have geometric meaning
- The linear representation hypothesis generalized this to ALL concepts in neural networks
- Superposition explains how networks pack MORE concepts than dimensions
- Sparse autoencoders (dictionary learning) decompose superposed representations back into interpretable features
- Circuit tracing connects features into computational pathways
- Golden Gate Claude demonstrates causal control over these features

### The Training -> Alignment Thread
- Pretraining creates a powerful but unaligned model
- SFT teaches it to follow instructions
- RLHF aligns it with human preferences
- Constitutional AI reduces human labor in alignment
- GRPO makes RL more efficient
- DeepSeek-R1 shows RL alone can produce reasoning

### The Understanding -> Limitations Thread
- Models learn compressed representations of the world
- But compression introduces shortcuts and heuristics
- Jagged intelligence results: stellar on some tasks, terrible on similar ones
- Hallucinations arise from specific circuit misfires, not random noise
- Unfaithful reasoning shows the model's explanation =/= its computation
- These aren't random bugs -- they're structural features of how these systems work

---

## SOURCES & REFERENCES

### Anthropic Research
- [Golden Gate Claude](https://www.anthropic.com/news/golden-gate-claude)
- [Mapping the Mind of a Language Model](https://www.anthropic.com/research/mapping-mind-language-model)
- [Tracing the Thoughts of a Language Model](https://www.anthropic.com/research/tracing-thoughts-language-model)
- [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
- [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html)
- [Towards Monosemanticity](https://transformer-circuits.pub/2023/monosemantic-features)
- [Scaling Monosemanticity](https://transformer-circuits.pub/2024/scaling-monosemanticity/)
- [Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)
- [Decomposing Language Models](https://www.anthropic.com/research/decomposing-language-models-into-understandable-components)
- [Zoom In: An Introduction to Circuits](https://distill.pub/2020/circuits/zoom-in/)
- [The Building Blocks of Interpretability](https://distill.pub/2018/building-blocks/)

### Researcher Interviews & Posts
- [Chris Olah on Interpretability (80,000 Hours)](https://80000hours.org/podcast/episodes/chris-olah-interpretability-research/)
- [Ilya Sutskever on Deep Learning as Alchemy (VentureBeat)](https://venturebeat.com/business/even-openais-ilya-sutskever-calls-deep-learning-alchemy)
- [Karpathy: Software 2.0](https://karpathy.medium.com/software-2-0-a64152b37c35)
- [Karpathy: A Recipe for Training Neural Networks](http://karpathy.github.io/2019/04/25/recipe/)
- [Karpathy: Deep Dive into LLMs like ChatGPT (TLDR)](https://anfalmushtaq.com/articles/deep-dive-into-llms-like-chatgpt-tldr)
- [Geoffrey Hinton Nobel Prize Speech](https://www.nobelprize.org/prizes/physics/2024/hinton/speech/)
- [Geoffrey Hinton Quotes](https://www.brainyquote.com/authors/geoffrey-hinton-quotes)

### Jagged Intelligence & Limitations
- [The Shape of AI: Jaggedness, Bottlenecks and Salients (Ethan Mollick)](https://www.oneusefulthing.org/p/the-shape-of-ai-jaggedness-bottlenecks)
- [Karpathy on Jagged Intelligence (X/Twitter)](https://x.com/karpathy/status/1816531576228053133)
- [Shortcut Learning in LLMs (arXiv)](https://arxiv.org/abs/2208.11857)
- [Do LLMs Overcome Shortcut Learning?](https://arxiv.org/html/2410.13343v1)

### Reasoning Models & Modern RL
- [OpenAI: Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/)
- [DeepSeek-R1 Paper](https://arxiv.org/abs/2501.12948)
- [GRPO Explained (Cameron Wolfe)](https://cameronrwolfe.substack.com/p/grpo)
- [GRPO Math Behind It (Medium)](https://medium.com/yugen-ai-technology-blog/understanding-the-math-behind-grpo-deepseek-r1-zero-9fb15e103a0a)
- [DeepSeek-R1 Explained (Hugging Face)](https://huggingface.co/blog/NormalUhr/deepseek-r1-explained)

### Visual Explainers
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/)
- [The Illustrated Word2Vec (Jay Alammar)](https://jalammar.github.io/illustrated-word2vec/)
- [3Blue1Brown: Attention in Transformers](https://www.3blue1brown.com/lessons/attention)
- [Transformer Explainer (Interactive)](https://poloclub.github.io/transformer-explainer/)
- [Visualizing the Loss Landscape of Neural Nets](https://arxiv.org/abs/1712.09913)
- [Loss Landscape Visual Exploration](https://jtuckerk.github.io/loss_landscape.html)
- [LLM Training with RLHF Visual Guide](https://huggingface.co/blog/rlhf)

### Training Pipeline
- [New LLM Pre-training and Post-training Paradigms (Sebastian Raschka)](https://sebastianraschka.com/blog/2024/new-llm-pre-training-and-post-training.html)
- [LLM Training: RLHF and Its Alternatives (Raschka)](https://magazine.sebastianraschka.com/p/llm-training-rlhf-and-its-alternatives)
- [The 3 Stages of LLM Training](https://datasciocean.com/en/ai-concept/llm-fine-tuning-rlhf/)
