# AAIP Observatory

The Autonomous Aerospace and Intellectual Property Observatory is a
curated interdisciplinary research resource examining intellectual
property issues involving autonomous and AI-enabled aerospace systems.

Following a realization of the difficulty of drawing conclusions across scholarship in an emerging field, I developed this project out of existing work I had compiled in order to better intellectually engage with my research interests. 

## Public components

- Homepage
- Searchable research database
- Public methodology
- Future analytical reports and archived dataset releases

## Data architecture

The master dataset is maintained in Google Sheets.

The public database page loads the published CSV using Papa Parse and
generates searchable source cards in the visitor's browser.

## Repository files

- `index.html` — project homepage
- `database.html` — database interface
- `methodology.html` — public research methodology
- `styles.css` — site design
- `database.js` — spreadsheet loading, search, filtering, and display
- `assets/` — optional images, reports, and downloadable files

## Dataset fields

- id
- title
- authors
- year
- publication
- sourceType
- aerospaceDomain
- autonomyType
- ipIssue
- jurisdiction
- summary
- relevance
- keywords
- url
- doi

## Source Types
Journal Article
Law Review Article
Conference Paper
Conference Proceeding
Book
Book Chapter
Dissertation
Master's Thesis
Technical Report
Government Report
White Paper
Policy Brief
Patent
Patent Application
Court Case
Administrative Decision
Regulation
Guidance Document
Standard
Working Paper
Magazine Article
News Article
Web Resource
Dataset
Presentation
Other

## Aerospace Domains
General Aerospace
Commercial Aviation
Military Aviation
Rotorcraft
General Aviation
Air Traffic Management
Uncrewed Aircraft Systems (UAS)
Advanced Air Mobility (AAM)
Urban Air Mobility (UAM)
Space Systems
Launch Systems
Satellite Systems
Space Operations
Hypersonics
Missile Systems
Flight Control Systems
Guidance, Navigation, and Control (GNC)
Aircraft Design
Propulsion
Avionics
Airworthiness & Certification
Remote Sensing
Earth Observation

## Autonomy Types
General Autonomy
Artificial Intelligence
Machine Learning
Deep Learning
Reinforcement Learning
Continual Learning
Online Learning
Adaptive Control
Adaptive Flight Control
Computer Vision
Sensor Fusion
Autonomous Navigation
Mission Autonomy
Decision Support Systems
Expert Systems
Generative AI
Generative Design
Human-in-the-Loop
Human-on-the-Loop
Human-out-of-the-Loop
Multi-Agent Systems
Swarm Autonomy
Robotics
Autonomous Spacecraft
Autonomous Aircraft
Autonomous UAS

## IP Issues
General Intellectual Property
Patent Law
Patent Eligibility
Patentability
Inventorship
Ownership
Assignment
Joint Inventorship
Enablement
Written Description
Obviousness
Novelty
Prior Art
Claim Construction
Patent Infringement
Patent Enforcement
Patent Licensing
Trade Secrets
Copyright
Software Copyright
Open Source Licensing
Data Ownership
Model Ownership
Technology Transfer
University Technology Transfer
Government Rights
Export Control
Standard-Essential Patents
Innovation Incentives
Research Exemptions

## Jurisdictions
United States
United Kingdom
European Union
Germany
France
Canada
Australia
Japan
China
India
South Korea
International
WIPO
EPO
USPTO
Federal Circuit
Supreme Court of the United States

# Publication Types
Academic
Government
Industry
Judicial
Legislative
Administrative
International Organization
Professional Society
University

## Keywords
Keywords are free-text, but should use semicolon-separated values. 

## Future Databases
Literature Database

Scholar Directory

Patent Database

Case Law Database

Government Documents

Standards Database

Conference Database

Institution Directory

Annual Reports

Research Gaps

## Maintainer

Elizabeth Owens