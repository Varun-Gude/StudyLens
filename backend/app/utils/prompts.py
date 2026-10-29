RESEARCH_PROMPT_TEMPLATE = """Act as an expert research scientist.

Analyze the research topic and the retrieved research papers.

Research Topic:
{TOPIC}

Research Papers:
{PAPERS}

Based on the provided research papers and the topic, generate a comprehensive, academic, detailed, and publication-oriented analysis.

You MUST respond with a single valid JSON object containing exactly the following keys. Do NOT wrap the JSON in markdown code blocks like ```json or similar; return the raw JSON object string directly.
The JSON keys and their expected content are:
1. "executive_summary": A detailed executive summary of the research area and key insights.
2. "overview": An academic introduction, definition, and background of the topic.
3. "literature_review": A detailed synthesis and critical analysis of the provided papers, comparing their methodologies, contributions, and findings.
4. "technologies": Key technologies, methodologies, frameworks, and algorithms used in the papers or relevant to the domain.
5. "trends": Current research trends, recent shifts, and growing areas of interest in this field.
6. "challenges": Principal challenges, bottlenecks, unresolved issues, or limitations facing researchers.
7. "research_gaps": Concrete research gaps identified in the current literature.
8. "future_scope": Future directions, opportunities, and promising avenues of exploration.
9. "project_ideas": A list of JSON objects (2-3 items) for final year student or engineering projects. Each object MUST contain:
    - "title": Clear project title.
    - "description": Short description of the concept.
    - "difficulty": "EASY", "MEDIUM", or "HARD".
    - "technologies": A list of 3-5 technology stack tags (e.g. ["Python", "TensorFlow", "FastAPI"]).
    - "dataset_info": An object with "name", "type", "purpose", "source" (URL or "N/A"), and "is_suggested" (boolean).
    - "development_time": Estimated development time (e.g., "3-4 Months").
    - "innovation_score": Integer rating from 0 to 10.
    - "feasibility": An object with "level" ("Suitable for Final Year Project", "Requires Advanced Research Resources", or "Not Recommended for Undergraduate Level") and "reason".
    - "career_relevance": A list of job roles/skills (e.g. ["ML Engineer", "Data Architect"]).
    - "industry_demand": "High", "Medium", or "Low".
    - "roadmap": An object containing:
        * "problem_statement": Detailed explanation of the problem.
        * "research_gap": The specific research gap addressed.
        * "objectives": A list of key objectives.
        * "system_architecture": High-level architecture or workflow.
        * "implementation_steps": A list of 4-6 sequential steps.
        * "expected_outcomes": Expected metrics or outcomes.
        * "future_enhancements": Future additions.
10. "publication_ideas": A list of JSON objects (2-3 items) for academic paper pathways. Each object MUST contain:
    - "title": Detailed research title.
    - "description": Summary of the proposed academic study.
    - "difficulty": "EASY", "MEDIUM", or "HARD".
    - "technologies": A list of tech/methodology tags (e.g. ["PyTorch", "LaTeX", "scikit-learn"]).
    - "dataset_info": An object with "name", "type", "purpose", "source" (URL or "N/A"), and "is_suggested" (boolean).
    - "development_time": Estimated study/writing duration (e.g., "5-6 Months").
    - "innovation_score": Integer rating from 0 to 10.
    - "feasibility": An object with "level" ("Suitable for Final Year Project", "Requires Advanced Research Resources", or "Not Recommended for Undergraduate Level") and "reason".
    - "publication_potential": "High", "Medium", or "Low".
    - "career_relevance": A list of academic/research roles (e.g. ["Research Scientist", "AI Researcher"]).
    - "industry_demand": "High", "Medium", or "Low".
    - "roadmap": An object containing:
        * "problem_statement": Detailed research question.
        * "research_gap": The specific research gap addressed.
        * "objectives": A list of research objectives.
        * "system_architecture": Proposed scientific framework or experimental setup.
        * "implementation_steps": A list of 4-6 methodology/experimental steps.
        * "expected_outcomes": Expected scientific contributions.
        * "future_enhancements": Future research directions.
        * "publication_opportunities": A list of target journals or conferences (e.g. ["NeurIPS", "IEEE Transactions"]).
11. "conclusion": Concluding remarks summarizing the state of the art and future perspective.
12. "analyzed_papers": A list of JSON objects corresponding to the input papers (maximum 7). Each object MUST contain:
    - "title": The exact title of the paper.
    - "difficulty": "EASY", "MEDIUM", or "HARD" based on:
        * EASY: Basic Machine Learning, small datasets, minimal infrastructure, standard APIs, beginner-friendly implementation.
        * MEDIUM: Deep Learning, multiple datasets, moderate deployment complexity, cloud integration, intermediate research skills.
        * HARD: Large-scale distributed systems, IoT integration, real-time processing, Quantum Computing, Reinforcement Learning, Multi-modal AI, advanced infrastructure, research-level implementation.
    - "feasibility": An object containing:
        * "level": Exactly one of "Suitable for Final Year Project", "Requires Advanced Research Resources", or "Not Recommended for Undergraduate Level".
        * "reason": A 1-2 sentence justification for students.
    - "technologies": A list of 4 to 6 specific technologies, frameworks, libraries, hardware, or algorithms mentioned or implied (e.g., ["Python", "TensorFlow", "IoT Sensors", "Deep Learning", "Edge Computing", "Computer Vision"]).
    - "datasets": A list of dataset objects (even if only one is used or suggested, provide it in a list). Each dataset object contains:
        * "name": Name of the dataset used or suggested (e.g., "CityFlow Dataset", "MNIST", "UCI Traffic Dataset").
        * "type": Type of dataset (e.g., "Traffic Video Dataset", "Tabular Dataset", "Text Corpus").
        * "purpose": Purpose of the dataset in the research.
        * "source": URL to the official repository/source (e.g., GitHub, Kaggle, UCI repo, Papers with Code) if available or searchable, else "N/A".
        * "is_suggested": boolean. Set to false if the paper explicitly mentions or uses the dataset; set to true if it is a suggested/inferred dataset from the domain.
    - "research_gap": A concise description of the identified research gap or limitation.
    - "suggested_research_direction": A concrete research direction or methodology to address the gap (e.g., "Integrating streaming ingestion pipelines with the proposed modeling would enable immediate drift detection").

Ensure all text fields are substantial, highly professional, academic in tone, and draw heavily from the metadata of the provided papers where relevant.
"""

