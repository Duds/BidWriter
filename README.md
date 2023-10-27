# BidWriter

## Overview
Automate the tedious process of writing bids and responding to Request for Tenders (RFTs) with the help of OpenAI's LLM API. This system tailors each bid using a mix of pre-defined templates and dynamically generated text, aiming to improve both efficiency and proposal quality.

## Features
- **Template-based Proposals**: Utilise customisable templates for various sections of a bid.
- **Dynamic Text Generation**: Leverage OpenAI's LLM API for generating tailored content.
- **User-Friendly Input**: Simple form-based input for key RFT details.
- **Database-Driven**: Store and manage past bids and templates in MongoDB.
- **Review and Edit**: Final review step to fine-tune the generated bid.
- **Export Options**: Export the final draft in multiple formats like PDF, Word etc.

## Tech Stack
- Jupyter Notebook for development and testing
- MongoDB for database storage
- OpenAI LLM API for text generation
- Express.js for optional web interface

## Setup
1. Clone the repository.
2. Install dependencies.
3. Set up MongoDB and populate it with initial data.
4. Run the notebook to start the system.

## How to Contribute
- Fork the project
- Create your feature branch (`git checkout -b feature/fooBar`)
- Commit your changes (`git commit -am 'Add some fooBar'`)
- Push to the branch (`git push origin feature/fooBar`)
- Create a new Pull Request

## License
Unlicense

