# Plaquita.com - Custom T-Shirt Design Editor

A React-based web application for creating custom t-shirt designs with an intuitive drag-and-drop interface. Built with Fabric.js for canvas manipulation and integrated with WooCommerce for e-commerce functionality.

## 🎨 Features

### Design Tools
- **Canvas Editor**: Interactive design canvas with Fabric.js
- **Text Tools**: Add and customize text with various fonts and styles
- **Image Upload**: Upload custom images and graphics
- **Clip Art Library**: Pre-built graphics and icons organized by categories
- **Color Tools**: Advanced color picker with predefined color palettes
- **Number Customization**: Specialized tools for adding numbers and text
- **Zoom Controls**: Zoom in/out functionality for detailed editing

### Design Areas
- **Main Design Area**: Primary design space (400x500px)
- **Chest Area**: Chest pocket design space (170x170px)
- **Sleeve Areas**: Left and right sleeve design spaces (190x190px each)

### E-commerce Integration
- **WooCommerce Integration**: Direct integration with WooCommerce API
- **Order Estimation**: Real-time pricing and order calculation
- **Product Management**: Seamless product creation and management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with Canvas support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plaquita.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.0** - Frontend framework
- **Fabric.js 6.6.6** - Canvas manipulation library
- **Styled Components 6.1.18** - CSS-in-JS styling
- **CRACO 7.1.0** - Create React App Configuration Override

### Key Dependencies
- **@fortawesome/react-fontawesome** - Icon library
- **react-icons** - Additional icon set
- **colorthief** - Color extraction from images
- **axios** - HTTP client for API requests
- **web-vitals** - Performance monitoring

### Development Tools
- **ESLint** - Code linting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── DesignEditor.js  # Main design editor component
│   ├── SideMenu.js      # Side navigation menu
│   ├── ToolBar.js       # Toolbar with design tools
│   ├── Text.js          # Text editing component
│   ├── UploadImage.js   # Image upload component
│   ├── ClipArt.js       # Clip art library
│   ├── Numbers.js       # Number customization
│   ├── ChangeColor.js   # Color picker
│   └── Styles.js        # Styled components
├── common/
│   └── functions.js     # Utility functions and constants
├── assets/
│   ├── cliparts/        # Clip art assets
│   └── fonts/           # Custom fonts
├── App.js               # Main application component
└── index.js             # Application entry point
```

## 🎯 Key Components

### DesignEditor.js
The main component that orchestrates the entire design experience:
- Manages the Fabric.js canvas
- Handles object selection and manipulation
- Coordinates between different design tools
- Manages design boundaries and constraints

### SideMenu.js
Navigation and tool selection:
- Tab-based interface for different design tools
- Upload, Text, Clip Art, and Numbers sections
- Color customization options
- Design area selection (main, chest, sleeves)

### ToolBar.js
Quick access to common actions:
- Zoom controls
- Undo/Redo functionality
- Object manipulation tools
- Design export options

## 🎨 Design Boundaries

The application supports multiple design areas with specific dimensions:

- **Main Area**: 400x500px - Primary design space
- **Chest Area**: 170x170px - Chest pocket design
- **Left Sleeve**: 190x190px - Left sleeve design
- **Right Sleeve**: 190x190px - Right sleeve design

## 🔧 Configuration

### CRACO Configuration
The project uses CRACO for custom webpack configuration:

```javascript
// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Process polyfill for browser compatibility
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
        })
      );
      
      // Node.js module fallbacks
      webpackConfig.resolve.fallback = {
        process: require.resolve('process/browser.js'),
      };
      
      return webpackConfig;
    },
  },
};
```

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_WOOCOMMERCE_URL=your_woocommerce_url
REACT_APP_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
REACT_APP_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
```

## 🎨 Clip Art Categories

The application includes a comprehensive clip art library:

- **Academy**: Educational and student-themed graphics
- **Animals**: Animal-themed graphics and icons
- **Letters**: Alphabet and letter graphics
- **Sports**: Sports equipment and activity graphics
- **Travel**: Travel and hospitality graphics

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Production Considerations
- Ensure all environment variables are set
- Configure WooCommerce API credentials
- Set up proper CORS policies for API access
- Optimize images and assets for production

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test -- --coverage
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v0.0.2** - Current version with enhanced design tools
- **v0.0.1** - Initial release with basic design functionality

## 🎯 Roadmap

- [ ] Advanced text effects and styling
- [ ] More clip art categories
- [ ] Design templates library
- [ ] Mobile-responsive design improvements
- [ ] Advanced color tools
- [ ] Design collaboration features
- [ ] Export to multiple formats

---

**Built with ❤️ using React and Fabric.js**