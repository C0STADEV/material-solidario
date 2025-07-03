# School Supplies Donation System

A web system that connects people who need school supplies with those who want to donate, promoting solidarity and education through a simple and efficient platform.

## 📋 About the Project

The School Supplies Donation System was developed to facilitate the connection between:
- **Requesters**: People who need school supplies for their children
- **Donors**: People who want to donate materials and earn benefits

### ✨ Main Features

#### For Requesters
- 📝 Secure registration and login
- 📋 Request up to 3 priority materials
- 🏢 Organized pickup through local CRAS
- 👥 Registration of multiple benefited children

#### For Donors
- 🎁 Registration of school supply donations
- ⭐ Points system per donation
- 🏪 Progressive discounts at partner bookstores
- 📅 Delivery scheduling at CRAS

#### Points System
- **5-9 points**: 5% discount
- **10-19 points**: 10% discount  
- **20+ points**: 15% discount

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **SQLite** - Database
- **bcryptjs** - Password Encryption
- **jsonwebtoken** - JWT Authentication
- **cors** - CORS Control

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript ES6+** - Interactivity
- **Bootstrap 5** - CSS Framework

### Infrastructure
- **Vercel** - Deploy and Hosting

## 🚀 How to Run

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/school-supplies-donation-system.git
cd school-supplies-donation-system
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure the database**
```bash
# Initialize the database
npm run init-db

# Or clean and recreate the database
npm run clean-db
```

4. **Start the development server**
```bash
# Development with nodemon
npm run dev

# Or production
npm start
```

5. **Access the application**
- Frontend: Open `frontend/index.html` in the browser
- API: `http://localhost:3001`

### Available Scripts

```bash
# Start server
npm start

# Development with auto reload
npm run dev

# Test database
npm run test

# Check database data
npm run check-db

# Initialize database
npm run init-db

# Clean and recreate database
npm run clean-db
```

## 📊 Project Structure

```
.
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication
│   │   ├── donations.js     # Donations
│   │   └── requests.js      # Requests
│   ├── database.js          # Database configuration
│   ├── server.js           # Main server
│   ├── check-data.js       # Data verification
│   ├── test-database.js    # Database tests
│   └── package.json        # Dependencies
├── frontend/
│   ├── css/
│   │   └── style.css       # Styles
│   ├── js/
│   │   └── app.js          # JavaScript
│   └── index.html          # Main interface
├── vercel.json             # Deploy configuration
└── README.md
```

## 🗃️ Database

### Tables

#### users
- `id` - Unique identifier
- `type` - Type (donor/requester)
- `nome` - Full name
- `email` - Unique email
- `password` - Encrypted password
- `telefone` - Contact phone
- `cidade` - City
- `endereco` - Address (requesters)
- `bairro` - Neighborhood (requesters)

#### donations
- `id` - Unique identifier
- `user_id` - Donor ID
- `doou_antes` - If donated before
- `items` - Donated items (JSON)
- `data_entrega` - Delivery date
- `cras` - Destination CRAS
- `points` - Points earned

#### requests
- `id` - Unique identifier
- `user_id` - Requester ID
- `nome_criancas` - Children names
- `quantidade` - Number of children
- `serie` - School grade/year
- `ciente` - Aware of CRAS pickup
- `materiais` - Requested materials (JSON)
- `status` - Request status

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Account creation with encrypted password
- **Login**: Validation and token generation
- **Protection**: Protected routes require valid token

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Registration
- `POST /api/auth/login` - Login

### Donations (Protected)
- `POST /api/donations` - Create donation
- `GET /api/donations/user/:userId` - User donations

### Requests (Protected)
- `POST /api/requests` - Create request
- `GET /api/requests/user/:userId` - User requests

## 🌍 Deploy

### Vercel
The project is configured for automatic deploy on Vercel:

1. **Connect your repository to Vercel**
2. **Configure environment variables if needed**
3. **Deploy will be automatic on every push**

Configuration is in `vercel.json`:
- Backend served at `/api/*`
- Frontend served at root

## 🧪 Testing

### Test Database
```bash
npm run test
```

### Check Data
```bash
npm run check-db
```

### Test Data
The test script creates example users:
- **Donor**: `joao@teste.com` / `teste123`
- **Requester**: `maria@teste.com` / `teste123`

## 📈 Points System

| Item | Points |
|------|--------|
| Notebook | 5 |
| Backpacks | 8 |
| Colored pencils | 4 |
| Pens | 1 |
| Pencils | 1 |
| Erasers | 1 |
| Sharpeners | 1 |
| Rulers | 2 |
| Pencil case | 3 |

## 🤝 How to Contribute

1. **Fork the project**
2. **Create a branch for your feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📝 License

This project is under the ISC license. See the `LICENSE` file for more details.

## 📧 Contact

For questions or suggestions, please contact through GitHub issues.

---

**Made with ❤️ to promote education and solidarity**
