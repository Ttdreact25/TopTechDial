<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level CMS & Blog Article Engine for SEO Strategy
 */

class BlogSystem {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Publish a new SEO Article
     */
    public function publishArticle($title, $content, $category, $authorId) {
        $slug = $this->generateSlug($title);
        $stmt = $this->db->prepare("
            INSERT INTO blog_articles (title, slug, content, category, author_id, status, publish_at)
            VALUES (?, ?, ?, ?, ?, 'published', NOW())
        ");
        
        if ($stmt->execute([$title, $slug, $content, $category, $authorId])) {
            return ['success' => true, 'id' => $this->db->lastInsertId()];
        }

        return ['success' => false, 'message' => 'Internal Server Error during Article Persistence'];
    }

    /**
     * Retrieve articles with pagination and filtering
     */
    public function getArticles($category = 'all', $limit = 10, $offset = 0) {
        $query = "SELECT a.*, u.name as author_name FROM blog_articles a JOIN users u ON a.author_id = u.id";
        if ($category !== 'all') {
            $query .= " WHERE a.category = ?";
            $stmt = $this->db->prepare($query . " ORDER BY a.publish_at DESC LIMIT ? OFFSET ?");
            $stmt->execute([$category, (int)$limit, (int)$offset]);
        } else {
            $stmt = $this->db->prepare($query . " ORDER BY a.publish_at DESC LIMIT ? OFFSET ?");
            $stmt->execute([(int)$limit, (int)$offset]);
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Fetch a single article by its unique slug
     */
    public function getArticleBySlug($slug) {
        $stmt = $this->db->prepare("
            SELECT a.*, u.name as author_name 
            FROM blog_articles a 
            JOIN users u ON a.author_id = u.id 
            WHERE a.slug = ?
        ");
        $stmt->execute([$slug]);
        $article = $stmt->fetch();

        if ($article) {
            // Increment view count for analytics
            $this->db->prepare("UPDATE blog_articles SET views = views + 1 WHERE id = ?")->execute([$article['id']]);
        }

        return $article;
    }

    /**
     * Generate a URL-friendly slug from string title
     */
    private function generateSlug($string) {
        $string = strtolower(trim($string));
        $string = preg_replace('/[^a-z0-9-]/', '-', $string);
        $string = preg_replace('/-+/', '-', $string);
        return rtrim($string, '-');
    }

    /**
     * Manage draft lifecycle (Unpublish / Schedule)
     */
    public function updateArticleStatus($id, $status) {
        $stmt = $this->db->prepare("UPDATE blog_articles SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $id]);
    }
}
?>
