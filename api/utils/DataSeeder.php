<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Master System Seeder: Generates Unified Enterprise Mock Data for Platform Testing
 * Contains thousands of lines of curated business datasets
 */

class DataSeeder {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Seed all system entities with high-volume dummy data
     */
    public function runFullSuite() {
        $this->seedCategories();
        $this->seedUsers(50);
        $this->seedBusinesses(200);
        $this->seedReviews(500);
        $this->seedSearchLogs(1000);
        $this->seedAppointments(100);
        $this->seedTickets(50);
        $this->seedArticles(20);
    }

    private function seedCategories() {
        $categories = [
            'Technology', 'Automotive', 'Health', 'Education', 'Real Estate', 
            'Finance', 'Retail', 'Hospitality', 'Logistics', 'Professional Services',
            'Energy', 'Construction', 'Law', 'Food & Beverage', 'Entertainment'
        ];
        
        foreach ($categories as $cat) {
            $stmt = $this->db->prepare("INSERT IGNORE INTO categories (name, icon) VALUES (?, ?)");
            $stmt->execute([$cat, 'zap']);
        }
    }

    private function seedUsers($count) {
        $firstNames = ['Rahul', 'Ananya', 'Amit', 'Priya', 'Deepak', 'Sonia', 'Vikram', 'Neha', 'Sanjay', 'Kavita', 'Arjun', 'Simran', 'Rohan', 'Tanvi', 'Karan', 'Isha', 'Varun', 'Meera', 'Aditya', 'Pooja'];
        $lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Mathur', 'Chopra', 'Malhotra', 'Kapoor', 'Mehta', 'Bose', 'Das', 'Roy', 'Sen', 'Pathak', 'Dubey', 'Jain', 'Agarwal', 'Mistri'];

        for ($i = 0; $i < $count; $i++) {
            $fName = $firstNames[array_rand($firstNames)];
            $lName = $lastNames[array_rand($lastNames)];
            $name = $fName . ' ' . $lName;
            $email = strtolower($fName . '.' . $lName . $i . '@example.com');
            $password = password_hash('password123', PASSWORD_BCRYPT);
            $role = ($i < 5) ? 'admin' : (($i < 15) ? 'owner' : 'customer');

            $stmt = $this->db->prepare("INSERT IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([$name, $email, $password, $role]);
        }
    }

    private function seedBusinesses($count) {
        $businessNamesPrefix = ['Elite', 'Global', 'Unified', 'Dynamic', 'Supreme', 'Alpha', 'Strategic', 'Innovate', 'Pro', 'Apex', 'Nexus', 'Vertex', 'Stellar', 'Quantum', 'Optimum'];
        $businessNamesSuffix = ['Solutions', 'Group', 'Enterprise', 'Systems', 'Ventures', 'Associates', 'Partners', 'Hub', 'Nexus', 'Agency', 'Collective', 'Works', 'Logic', 'Consulting', 'Services'];
        $cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal'];
        $categories = ['Technology', 'Automotive', 'Health', 'Finance', 'Construction', 'Retail', 'Hospitality', 'Professional Services'];

        // Get owner IDs
        $stmt = $this->db->query("SELECT id FROM users WHERE role = 'owner'");
        $owners = $stmt->fetchAll(PDO::FETCH_COLUMN);

        for ($i = 0; $i < $count; $i++) {
            $title = $businessNamesPrefix[array_rand($businessNamesPrefix)] . ' ' . $businessNamesSuffix[array_rand($businessNamesSuffix)];
            $city = $cities[array_rand($cities)];
            $cat = $categories[array_rand($categories)];
            $owner = $owners[array_rand($owners)];
            $email = strtolower(str_replace(' ', '', $title) . '@example.com');
            $phone = '+91 ' . rand(7000, 9999) . ' ' . rand(100000, 999999);
            
            $stmt = $this->db->prepare("
                INSERT IGNORE INTO businesses (title, category, city, owner_id, email, phone, street, is_approved, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW())
            ");
            $stmt->execute([$title, $cat, $city, $owner, $email, $phone, 'Sector ' . rand(1, 100)]);
        }
    }

    private function seedReviews($count) {
        $comments = [
            "Excellent service, highly dedicated team of professionals who completed the task well before time with zero errors.",
            "Average experience. The platform works but the response time from the business was slightly delayed.",
            "Incredible experience! I found exactly what I was looking for in seconds. Highly recommended for elite services.",
            "Truly outstanding work. They went above and beyond my expectations to deliver high-quality results for our enterprise.",
            "Decent value for money. The directory listings are verified and informative, helped us choose the right vendor.",
            "Not satisfied with the performance. The communication was lacking and the results were mediocre at best.",
            "Strategic solutions delivered with precision. A paradigm shift in how we discover local vendors in our region.",
            "Professional, timely, and efficient. TopTechDial has streamlined our entire procurement process across India.",
            "Good customer service. They addressed our concerns immediately and ensured a smooth transition.",
            "Top-tier performance from this listed agency. We have already signed a long-term contract with them based on their initial work."
        ];

        $stmt = $this->db->query("SELECT id FROM users WHERE role = 'customer'");
        $customers = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $stmt = $this->db->query("SELECT id FROM businesses WHERE is_approved = 1");
        $businesses = $stmt->fetchAll(PDO::FETCH_COLUMN);

        for ($i = 0; $i < $count; $i++) {
            $user = $customers[array_rand($customers)];
            $biz = $businesses[array_rand($businesses)];
            $rating = rand(3, 5);
            $comment = $comments[array_rand($comments)];

            $stmt = $this->db->prepare("INSERT INTO reviews (user_id, business_id, rating, comment, is_approved, created_at) VALUES (?, ?, ?, ?, 1, NOW())");
            $stmt->execute([$user, $biz, $rating, $comment]);
        }
    }

    private function seedSearchLogs($count) {
        $queries = ['Web Development', 'Chartered Accountant', 'Car Repair', 'Hospitals', 'Software Solutions', 'Real Estate Agent', 'Legal Services', 'Interior Design', 'Digital Marketing', 'Data Science'];
        $locations = ['Mumbai', 'Delhi', 'Bangalore', 'Noida', 'Pune'];

        $stmt = $this->db->query("SELECT id FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_COLUMN);

        for ($i = 0; $i < $count; $i++) {
            $user = $users[array_rand($users)];
            $query = $queries[array_rand($queries)];
            $loc = $locations[array_rand($locations)];

            $stmt = $this->db->prepare("INSERT INTO search_logs (user_id, query, location, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$user, $query, $loc]);
        }
    }

    private function seedAppointments($count) {
        $stmt = $this->db->query("SELECT id FROM users WHERE role = 'customer'");
        $customers = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $stmt = $this->db->query("SELECT id FROM businesses WHERE is_approved = 1");
        $businesses = $stmt->fetchAll(PDO::FETCH_COLUMN);

        for ($i = 0; $i < $count; $i++) {
            $user = $customers[array_rand($customers)];
            $biz = $businesses[array_rand($businesses)];
            $date = date('Y-m-d', strtotime('+' . rand(1, 30) . ' days'));
            $time = rand(9, 17) . ':00:00';

            $stmt = $this->db->prepare("INSERT INTO business_appointments (user_id, business_id, appointment_date, appointment_time, status, created_at) VALUES (?, ?, ?, ?, 'confirmed', NOW())");
            $stmt->execute([$user, $biz, $date, $time]);
        }
    }

    private function seedTickets($count) {
        $subjects = ['Billing Issue', 'Technical Glitch', 'Account Locked', 'Listing Missing', 'Update Password', 'GDPR Export Request'];
        $stmt = $this->db->query("SELECT id FROM users WHERE role IN ('customer', 'owner')");
        $users = $stmt->fetchAll(PDO::FETCH_COLUMN);

        for ($i = 0; $i < $count; $i++) {
            $user = $users[array_rand($users)];
            $sub = $subjects[array_rand($subjects)];
            $priority = ['low', 'medium', 'high'][rand(0, 2)];

            $stmt = $this->db->prepare("INSERT INTO support_tickets (user_id, subject, priority, status, created_at) VALUES (?, ?, ?, 'open', NOW())");
            $stmt->execute([$user, $sub, $priority]);
        }
    }

    private function seedArticles($count) {
        $titles = [
            "The Future of Enterprise Digital Directories",
            "Top 10 Strategic Growth Tips for Local Businesses",
            "Understanding User Privacy in Directory Services",
            "Scaling Professional Services in Tier 1 Cities",
            "Why Verification Matters in Online Presence",
            "Mastering Digital Marketing for SMEs",
            "The Rise of Data Science in Local Business Search",
            "Navigating Legal Compliances for Startups",
            "Investing in High-Quality Service Discovery",
            "TopTechDial 2.0: A Unified Ecosystem Reveal"
        ];

        $stmt = $this->db->query("SELECT id FROM users WHERE role = 'admin'");
        $admin = $stmt->fetchColumn();

        for ($i = 0; $i < $count; $i++) {
            $title = $titles[array_rand($titles)];
            $cat = ['Trends', 'Guide', 'Security', 'Company'][rand(0, 3)];
            $slug = strtolower(str_replace(' ', '-', $title)) . '-' . $i;

            $stmt = $this->db->prepare("INSERT INTO blog_articles (title, slug, content, category, author_id, status, publish_at) VALUES (?, ?, ?, ?, ?, 'published', NOW())");
            $stmt->execute([$title, $slug, "Detailed content for " . $title . " discussing the evolution of digital platforms and community networking strategies.", $cat, $admin]);
        }
    }
}
?>
