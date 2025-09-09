# AffordMed URL Shortener

A modern, responsive URL shortener application built with React, JavaScript, and vanilla CSS. This application allows users to shorten multiple URLs at once, create custom shortcodes, and track detailed analytics.

## Features

- **Bulk URL Shortening**: Shorten up to 5 URLs simultaneously
- **Custom Shortcodes**: Create memorable, custom shortcodes for your links
- **Click Analytics**: Track clicks with detailed statistics and timestamps
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data is stored locally in your browser for privacy
- **Real-time Statistics**: View comprehensive analytics for all your shortened URLs
- **Error Handling**: User-friendly error messages and validation
- **Custom Logging**: Built-in logging system for debugging and monitoring

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahul-1809/22341A4239.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Shortening URLs

1. Navigate to the home page
2. Enter up to 5 URLs in the form
3. Optionally add custom shortcodes for any URL
4. Click "Shorten URLs" to process all URLs
5. Copy the generated short URLs from the results

### Viewing Statistics

1. Click on "Statistics" in the navigation
2. View overview statistics (total URLs, clicks, custom shortcodes)
3. Browse all your shortened URLs in the table
4. Click "View Details" on any URL to see detailed analytics
5. View recent click history with timestamps and user agent information

### Accessing Short URLs

- Short URLs follow the format: `http://localhost:3000/{shortcode}`
- When accessed, they automatically redirect to the original URL
- Each click is logged with timestamp and browser information

## Technical Details

### Architecture

- **Frontend**: React 18 with functional components and hooks
- **Routing**: React Router v6 for client-side navigation
- **Storage**: localStorage for data persistence
- **Styling**: Vanilla CSS with responsive design
- **State Management**: React useState and useEffect hooks

### File Structure

```
src/
├── components/
│   ├── Header.js          # Navigation header
│   ├── UrlForm.js         # URL input form
│   ├── UrlResults.js      # Results display
│   └── RedirectHandler.js # URL redirection logic
├── pages/
│   ├── ShortenerPage.js   # Main shortening page
│   └── StatsPage.js       # Statistics and analytics
├── utils/
│   ├── storage.js         # localStorage utilities
│   ├── logger.js          # Custom logging system
│   └── urlUtils.js        # URL validation and utilities
├── styles/
│   └── index.css          # Global styles
├── App.js                 # Main app component
└── index.js              # App entry point
```

### Key Features Implementation

#### URL Validation
- Client-side URL validation using the URL constructor
- Automatic protocol addition (https://) for incomplete URLs
- Custom shortcode validation with uniqueness checking

#### Shortcode Generation
- Random shortcode generation with configurable length
- Uniqueness checking against existing shortcodes
- Fallback mechanism for collision resolution

#### Data Persistence
- All data stored in browser's localStorage
- JSON serialization for complex data structures
- Automatic data cleanup to prevent storage bloat

#### Analytics Tracking
- Click counting and timestamp logging
- User agent and referrer tracking
- Time-based analytics (clicks by day/hour)
- Recent click history with detailed information

#### Error Handling
- Comprehensive form validation
- User-friendly error messages
- Graceful fallbacks for edge cases
- Custom logging for debugging

## Customization

### Styling
The application uses vanilla CSS with CSS custom properties for easy theming. Key color variables can be modified in the CSS file:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --error-color: #e53e3e;
  --text-color: #2d3748;
  --text-muted: #718096;
}
```

### Configuration
Various settings can be modified in the utility files:

- Shortcode length (default: 6 characters)
- Maximum URLs per batch (default: 5)
- Log retention limit (default: 1000 entries)
- URL validation rules

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App

### Code Style

- ES6+ JavaScript features
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling
- Detailed inline documentation

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please create an issue in the repository or contact the development team.
