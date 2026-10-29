import httpx
import json
import re
from typing import List, Dict, Any
from app.utils.config import settings
from app.utils.prompts import RESEARCH_PROMPT_TEMPLATE
from app.schemas.search_schema import PaperInfo, DatasetInfo, FeasibilityInfo

class GeminiService:
    @staticmethod
    def _clean_json_response(text: str) -> str:
        """
        Cleans markdown JSON code blocks from the API response text if present,
        or extracts the JSON object directly if there is surrounding conversational text.
        """
        text = text.strip()
        
        # 1. Look for ```json ... ``` or ``` ... ```
        pattern = r'```(?:json)?\s+(.*?)\s*```'
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1).strip()
            
        # 2. Fallback: Find the first '{' and last '}'
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            return text[start_idx:end_idx + 1]
            
        return text

    @classmethod
    def generate_mock_report(cls, topic: str, papers: List[PaperInfo]) -> Dict[str, Any]:
        """
        Generate a detailed mock research report when the API key is missing, invalid, or calls fail.
        """
        # Ensure we only process at most 7 papers in-place
        papers[:] = papers[:7]
        
        # Predefined pools for mock generation
        mock_difficulties = ["EASY", "MEDIUM", "HARD"]
        mock_feasibility_levels = [
            ("Suitable for Final Year Project", "Well-scoped dataset and standard algorithm stack suitable for undergraduate timelines."),
            ("Requires Advanced Research Resources", "Demands high-end GPUs, cloud compute, or extensive custom dataset annotation."),
            ("Not Recommended for Undergraduate Level", "Requires specialized hardware sensors or novel mathematical derivations.")
        ]
        
        # Populate rich metadata for each mock paper
        for i, paper in enumerate(papers):
            diff = mock_difficulties[i % len(mock_difficulties)]
            feas_level, feas_reason = mock_feasibility_levels[i % len(mock_feasibility_levels)]
            
            paper.difficulty = diff
            paper.feasibility = FeasibilityInfo(level=feas_level, reason=feas_reason)
            paper.technologies = ["Python", "TensorFlow", "PyTorch", "OpenCV", "Scikit-Learn", "FastAPI"][:(4 + i % 3)]
            
            # Dataset info (List of datasets)
            ds_used = DatasetInfo(
                name=f"CityFlow Dataset v{i+1}" if i % 2 == 0 else f"TrafficNet Dataset v{i+1}",
                type="Traffic Video Dataset" if i % 2 == 0 else "Tabular Vehicle Logs",
                purpose="Used for vehicle detection, traffic density estimation, and speed tracking.",
                source="https://cityflow-project.github.io/" if i % 2 == 0 else "https://github.com/alex-trafficnet/trafficnet",
                is_suggested=False
            )
            
            ds_suggested = DatasetInfo(
                name=f"Suggested {topic.title()} Benchmark",
                type="Inferred Domain Dataset",
                purpose="Recommended for cross-domain validation and evaluating model generalization under simulated drift.",
                source="https://paperswithcode.com/datasets",
                is_suggested=True
            )
            
            paper.datasets = [ds_used, ds_suggested]
            paper.dataset_info = ds_used
                
            paper.research_gap = f"The study in '{paper.title}' focuses primarily on controlled benchmark conditions and lacks validation under dynamic real-world workloads."
            paper.suggested_research_direction = f"Integrating streaming ingestion pipelines with the proposed modeling in '{paper.title}' would enable immediate drift detection and improve operational robustness."
            paper.research_assumption = paper.suggested_research_direction

        # Generate structured projects & publications
        mock_projects = [
            {
                "title": f"Edge-{topic.replace(' ', '')}-Predictor Engine",
                "description": f"A lightweight inference engine optimized for localized edge hardware predicting {topic}.",
                "difficulty": "MEDIUM",
                "technologies": ["Python", "TensorFlow Lite", "FastAPI", "Raspberry Pi"],
                "dataset_info": {
                    "name": "CityFlow Dataset",
                    "type": "Traffic Video Dataset",
                    "purpose": "Used for training and evaluating localized vehicle detection algorithms.",
                    "source": "https://cityflow-project.github.io/",
                    "is_suggested": False
                },
                "development_time": "3-4 Months",
                "innovation_score": 8,
                "feasibility": {
                    "level": "Suitable for Final Year Project",
                    "reason": "Standard APIs and hardware requirements align well with academic schedules."
                },
                "career_relevance": ["ML Engineer", "Embedded Systems Developer"],
                "industry_demand": "High",
                "roadmap": {
                    "problem_statement": f"Standard {topic} models have high latency and memory footprints, preventing deployment on localized edge sensors.",
                    "research_gap": "Lack of lightweight optimized compression frameworks suitable for low-power edge nodes.",
                    "objectives": [
                        "Optimize deep models using quantization and distillation.",
                        "Deploy lightweight API serving on a simulated Raspberry Pi environment.",
                        "Measure latency, memory foot-print and accuracy tradeoffs."
                    ],
                    "system_architecture": "Data Ingestion Pipeline -> Quantized Model Inference Engine -> FastAPI Serving Endpoint -> Dashboard UI.",
                    "implementation_steps": [
                        "Acquire CityFlow dataset and select a baseline model.",
                        "Apply Post-Training Quantization (INT8) using TensorFlow Lite.",
                        "Wrap quantized engine in a lightweight FastAPI router.",
                        "Build visual dashboard using HTML5/React to display performance graphs."
                    ],
                    "expected_outcomes": "A functional lightweight model with <50ms latency and minimal footprint degradation.",
                    "future_enhancements": "Support federated learning across multiple local nodes."
                }
            },
            {
                "title": f"Continual Learning Benchmark Suite for {topic.replace(' ', '')}",
                "description": "A simulation testbed for evaluating model drift over time under dynamic environment changes.",
                "difficulty": "HARD",
                "technologies": ["PyTorch", "Docker", "Apache Kafka", "Streamlit"],
                "dataset_info": {
                    "name": "Suggested Multimodal Time-Series Dataset",
                    "type": "Tabular Sensor Logs & Video Streams",
                    "purpose": "Simulating high-throughput operational data pipelines.",
                    "source": "https://paperswithcode.com/datasets",
                    "is_suggested": True
                },
                "development_time": "5-6 Months",
                "innovation_score": 9,
                "feasibility": {
                    "level": "Requires Advanced Research Resources",
                    "reason": "Setting up distributed streaming infrastructure like Kafka and multi-modal models requires cloud setup."
                },
                "career_relevance": ["Data Scientist", "Data Engineer"],
                "industry_demand": "High",
                "roadmap": {
                    "problem_statement": "Merging unstructured video feeds with structured logs in real-time is computationally complex.",
                    "research_gap": "Unresolved synchronization latencies between heterogeneous sensor networks.",
                    "objectives": [
                        "Construct a high-throughput streaming broker system.",
                        "Implement multi-modal fusion networks for predictions.",
                        "Visualize predictions dynamically in an interactive UI."
                    ],
                    "system_architecture": "Heterogeneous Data Sources -> Apache Kafka ingestion -> Multi-modal PyTorch model -> Web Sockets server -> React UI.",
                    "implementation_steps": [
                        "Create Kafka topics for simulated video and tabular logs.",
                        "Develop a fusion model combining log embeddings and video frame features.",
                        "Optimize the inference pipeline to work within streaming windows.",
                        "Create React dashboard showing real-time metrics."
                    ],
                    "expected_outcomes": "System dashboard displaying synced prediction accuracies above 90% in real-time.",
                    "future_enhancements": "Introduce automated anomaly alerting via push notifications."
                }
            }
        ]

        mock_publications = [
            {
                "title": f"A Comprehensive Evaluation of Transformer Architectures on {topic.title()} Benchmarks",
                "description": "A comparative study evaluating various transformer configurations for prediction accuracy and performance.",
                "difficulty": "MEDIUM",
                "technologies": ["PyTorch", "Hugging Face", "LaTeX", "scikit-learn"],
                "dataset_info": {
                    "name": "Kaggle Open Dataset",
                    "type": "Structured Text Corpus",
                    "purpose": "Used as the target sequence dataset for classification benchmarks.",
                    "source": "https://www.kaggle.com/",
                    "is_suggested": False
                },
                "development_time": "4-5 Months",
                "innovation_score": 7,
                "feasibility": {
                    "level": "Suitable for Final Year Project",
                    "reason": "Uses standard open-source libraries and public Kaggle datasets, needing standard training hardware."
                },
                "publication_potential": "High",
                "career_relevance": ["Research Scientist", "NLP Engineer"],
                "industry_demand": "Medium",
                "roadmap": {
                    "problem_statement": f"Absence of comparative studies detailing transformer performance specifically for {topic}.",
                    "research_gap": "Lack of standardized performance baselines across low-power sequence attention heads.",
                    "objectives": [
                        "Benchmark BERT, RoBERTa, and GPT models on the target domain dataset.",
                        "Compare classification F1-scores, training latency, and parameters.",
                        "Compile results into a structured draft matching IEEE template."
                    ],
                    "system_architecture": "Data Ingest -> Tokenization -> Model Fine-Tuning -> Metrics Evaluator -> LaTeX Report.",
                    "implementation_steps": [
                        "Download corpus from Kaggle and preprocess raw texts.",
                        "Fine-tune HuggingFace transformer checkpoints on local GPU.",
                        "Evaluate model configurations across precision and recall.",
                        "Write IEEE template LaTeX paper with tables and diagrams."
                    ],
                    "expected_outcomes": "A complete academic paper outline with verified performance comparisons.",
                    "future_enhancements": "Examine multilingual adapters to expand language domain.",
                    "publication_opportunities": ["IEEE Access", "EMNLP Findings"]
                }
            },
            {
                "title": f"Mitigating Dataset Shift in {topic.title()}: A Domain-Adversarial Approach",
                "description": "A study proposing domain-adversarial networks to generalize prediction accuracy under distribution drift.",
                "difficulty": "HARD",
                "technologies": ["PyTorch", "CUDA", "TensorBoard", "LaTeX"],
                "dataset_info": {
                    "name": "Suggested Domain Adaptation Corpus",
                    "type": "Cross-Domain Log Data",
                    "purpose": "Used to test domain transfer and distribution shift robustness.",
                    "source": "https://paperswithcode.com/datasets",
                    "is_suggested": True
                },
                "development_time": "6-7 Months",
                "innovation_score": 9,
                "feasibility": {
                    "level": "Requires Advanced Research Resources",
                    "reason": "Requires high-end GPU compute for adversarial training loops and advanced research skill sets."
                },
                "publication_potential": "High",
                "career_relevance": ["AI Researcher", "Machine Learning Specialist"],
                "industry_demand": "High",
                "roadmap": {
                    "problem_statement": "Distribution shift degrades model performance when deployed on out-of-distribution environments.",
                    "research_gap": "Absence of domain alignment layers optimized specifically for real-time sequence prediction shifts.",
                    "objectives": [
                        "Develop a domain-adversarial loss function layer.",
                        "Evaluate feature invariance across target domains.",
                        "Achieve higher shift resilience compared to traditional baselines."
                    ],
                    "system_architecture": "Feature Extractor Network -> (Predictor Head + Domain Classifier Head with Gradient Reversal Layer).",
                    "implementation_steps": [
                        "Acquire source and shifted target datasets.",
                        "Implement Gradient Reversal Layer (GRL) in PyTorch.",
                        "Train model adversarially to extract domain-invariant features.",
                        "Document findings in a comprehensive manuscript."
                    ],
                    "expected_outcomes": "Validated model maintaining >85% accuracy under distribution shift.",
                    "future_enhancements": "Extend adversarial training to multi-source domain alignment.",
                    "publication_opportunities": ["NeurIPS", "CVPR", "IEEE Transactions on Pattern Analysis"]
                }
            }
        ]

        paper_titles = [p.title for p in papers[:3]] if papers else ["seminal literature"]
        paper_titles_str = ", ".join(f"'{t}'" for t in paper_titles)
        
        import json
        return {
            "executive_summary": f"This report synthesizes the current academic literature surrounding '{topic}'. Modern investigations are increasingly focusing on scaling issues, multi-agent frameworks, and benchmark evaluations. Seminal works like {paper_titles_str} highlight critical methodologies for establishing performance baselines.",
            "overview": f"The field of '{topic}' combines foundational computer science principles with recent domain-specific adaptations. As computing resources scale and data availability increases, establishing a clear conceptual framework becomes essential for future theoretical breakthroughs.",
            "literature_review": f"A comparative analysis of recent publications including {paper_titles_str} shows a clear division: earlier models prioritized statistical generalization, whereas contemporary methods utilize deep transformer blocks and self-supervised training workflows. Discrepancies exist in how validation benchmarks are reported across research groups.",
            "technologies": f"- Adaptive {topic} Algorithms: Methods designed to optimize computational load.\n- Multi-Layer Attention Models: Core transformer architectures adapted for high-dimensional feature analysis.\n- Federated Learning Sync Protocols: Frameworks to maintain private datasets across institutional boundaries.",
            "trends": f"- Transition from localized statistical models to global foundation models.\n- Increasing adoption of zero-shot transfer learning methodologies.\n- Heightened focus on interpretability and explainable AI paradigms.",
            "challenges": f"- High computational overhead required for pre-training large models.\n- Dataset shift and performance degradation under out-of-distribution scenarios.\n- Absence of standardized validation benchmarks for low-resource environments.",
            "research_gaps": f"- Robust continuous learning pipelines that prevent catastrophic forgetting in domain-specific tasks.\n- Multilingual extraction techniques for unstructured raw reports.\n- Low-power inference models suitable for edge-device integration.",
            "future_scope": f"- Developing light-weight distillation methods to compress model size while retaining accuracy.\n- Designing automated benchmarking protocols with synthetic data generators.\n- Exploring hybrid quantum-classical algorithms for ultra-large search spaces.",
            "project_ideas": json.dumps(mock_projects),
            "publication_ideas": json.dumps(mock_publications),
            "conclusion": f"In conclusion, the research domain of '{topic}' is maturing rapidly. Addressing open challenges in dataset shift, edge deployment, and explainability will pave the way for widespread real-world adoption."
        }

    @classmethod
    async def generate_research_report(cls, topic: str, papers: List[PaperInfo]) -> Dict[str, Any]:
        """
        Send topic and retrieved papers metadata to Gemini API to generate structured research report.
        """
        # Ensure we only process at most 7 papers in-place
        papers[:] = papers[:7]

        # If API key is not set or is the standard mock placeholder, fall back to mock report generation
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "mock_gemini_api_key_placeholder":
            print("Using fallback mock report generator (mock/missing GEMINI_API_KEY)...")
            return cls.generate_mock_report(topic, papers)

        # Format papers details for prompt input
        papers_text = ""
        for i, paper in enumerate(papers, 1):
            authors_str = ", ".join(paper.authors) if paper.authors else "Unknown Authors"
            papers_text += (
                f"Paper #{i}:\n"
                f"Title: {paper.title}\n"
                f"Authors: {authors_str}\n"
                f"Year: {paper.year or 'N/A'}\n"
                f"Citations: {paper.citation_count}\n"
                f"Abstract: {paper.abstract}\n"
                f"----------------------------------------\n"
            )

        prompt = RESEARCH_PROMPT_TEMPLATE.format(TOPIC=topic, PAPERS=papers_text)
        
        # REST URL for Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                res_data = response.json()
                
                # Navigate standard Gemini response path
                candidates = res_data.get("candidates", [])
                if not candidates:
                    raise Exception("No response candidates returned from Gemini API.")
                
                text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if not text_content:
                    raise Exception("Empty content returned from Gemini API.")

                cleaned_text = cls._clean_json_response(text_content)
                
                try:
                    report_data = json.loads(cleaned_text)
                    
                    # Ensure all required keys are present, set defaults if any are missing
                    required_keys = [
                        "executive_summary", "overview", "literature_review", "technologies",
                        "trends", "challenges", "research_gaps", "future_scope",
                        "project_ideas", "publication_ideas", "conclusion"
                    ]
                    for key in required_keys:
                        if key not in report_data:
                            report_data[key] = f"No detailed {key.replace('_', ' ')} could be generated."

                    # Serialize project_ideas & publication_ideas to string if they are parsed as structures
                    if "project_ideas" in report_data and not isinstance(report_data["project_ideas"], str):
                        report_data["project_ideas"] = json.dumps(report_data["project_ideas"])
                    if "publication_ideas" in report_data and not isinstance(report_data["publication_ideas"], str):
                        report_data["publication_ideas"] = json.dumps(report_data["publication_ideas"])
                    
                    # Merge analyzed_papers into the input papers list
                    analyzed_list = report_data.get("analyzed_papers", [])
                    analyzed_map = {p.get("title", "").lower().strip(): p for p in analyzed_list if isinstance(p, dict)}
                    
                    for paper in papers:
                        title_clean = (paper.title or "").lower().strip()
                        match = analyzed_map.get(title_clean)
                        if not match:
                            # Substring matching
                            for t, val in analyzed_map.items():
                                if t in title_clean or title_clean in t:
                                    match = val
                                    break
                        
                        if match:
                            # 1. Difficulty
                            diff = match.get("difficulty", "").upper()
                            if diff in ["EASY", "MEDIUM", "HARD"]:
                                paper.difficulty = diff
                            else:
                                paper.difficulty = "MEDIUM"
                                
                            # 2. Feasibility
                            feas = match.get("feasibility")
                            if isinstance(feas, dict):
                                level = feas.get("level", "Suitable for Final Year Project")
                                reason = feas.get("reason", "Analyzed based on paper requirements.")
                                paper.feasibility = FeasibilityInfo(level=level, reason=reason)
                            elif isinstance(feas, str):
                                paper.feasibility = FeasibilityInfo(level=feas, reason="Analyzed based on methodology.")

                            # 3. Technologies
                            techs = match.get("technologies")
                            if isinstance(techs, list):
                                paper.technologies = [str(t) for t in techs if t]
                            
                            # 4. Dataset Info & Datasets List
                            ds_list = match.get("datasets")
                            parsed_datasets = []
                            if isinstance(ds_list, list):
                                for ds in ds_list:
                                    if isinstance(ds, dict):
                                        parsed_datasets.append(DatasetInfo(
                                            name=ds.get("name", "Standard Domain Dataset"),
                                            type=ds.get("type", "Benchmark Dataset"),
                                            purpose=ds.get("purpose", "Used for evaluation and testing."),
                                            source=ds.get("source", "N/A"),
                                            is_suggested=bool(ds.get("is_suggested", False))
                                        ))
                            
                            # Fallback to dataset_info if datasets is missing or empty
                            single_ds = match.get("dataset_info")
                            if not parsed_datasets and isinstance(single_ds, dict):
                                parsed_datasets.append(DatasetInfo(
                                    name=single_ds.get("name", "Standard Domain Dataset"),
                                    type=single_ds.get("type", "Benchmark Dataset"),
                                    purpose=single_ds.get("purpose", "Used for evaluation and testing."),
                                    source=single_ds.get("source", "N/A"),
                                    is_suggested=bool(single_ds.get("is_suggested", False))
                                ))

                            paper.datasets = parsed_datasets
                            if parsed_datasets:
                                paper.dataset_info = parsed_datasets[0]

                            # 5. Gaps & Direction
                            paper.research_gap = match.get("research_gap")
                            sug_dir = match.get("suggested_research_direction") or match.get("research_assumption")
                            paper.suggested_research_direction = sug_dir
                            paper.research_assumption = sug_dir

                        # Set fallbacks if AI missed any properties
                        if not paper.difficulty:
                            paper.difficulty = "MEDIUM"
                        if not paper.technologies:
                            paper.technologies = ["Python", "Machine Learning", "Data Processing"]
                        if not paper.datasets:
                            fallback_ds = DatasetInfo(
                                name=f"Suggested {topic.title()} Dataset",
                                type="Inferred Benchmark Dataset",
                                purpose="Empirical performance testing and baseline validation.",
                                source="N/A",
                                is_suggested=True
                            )
                            paper.datasets = [fallback_ds]
                            paper.dataset_info = fallback_ds
                        if not paper.feasibility:
                            paper.feasibility = FeasibilityInfo(
                                level="Suitable for Final Year Project",
                                reason="Standard algorithmic complexity suitable for engineering projects."
                            )
                        if not paper.research_gap:
                            paper.research_gap = f"The study described in '{paper.title}' relies heavily on specific benchmark assumptions and lacks real-time validation."
                        if not paper.suggested_research_direction:
                            sug = f"Testing these frameworks under dynamically varying workloads would demonstrate actual production reliability."
                            paper.suggested_research_direction = sug
                            paper.research_assumption = sug
                            
                    return report_data
                except json.JSONDecodeError as jde:
                    print(f"Failed to parse cleaned JSON content. Raw output: {text_content}")
                    raise Exception(f"Failed to parse Gemini response as JSON: {str(jde)}")
                    
        except Exception as e:
            # Fall back dynamically to mock generator upon any API failure, rate limiting, or connection error
            print(f"Error querying Gemini API ({e}). Falling back to mock report generator...")
            return cls.generate_mock_report(topic, papers)

