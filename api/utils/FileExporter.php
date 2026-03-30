<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 * 
 * Enterprise Level File Export Service supporting multiple formats
 */

class FileExporter {
    /**
     * Export data to a CSV file structure
     */
    public function toCsv($data, $filename = "export.csv") {
        if (empty($data)) return false;
        
        $output = fopen('php://temp', 'r+');
        fputcsv($output, array_keys($data[0]));
        
        foreach ($data as $row) {
            fputcsv($output, array_values($row));
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $csv;
        exit;
    }

    /**
     * Export complex nested data to JSON representation
     */
    public function toJson($data, $filename = "export.json") {
        $json = json_encode($data, JSON_PRETTY_PRINT);
        
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $json;
        exit;
    }

    /**
     * Simulated XML export for legacy compliance
     */
    public function toSimpleXml($data, $rootNode = "TopTechDialExport", $filename = "export.xml") {
        $xml = new SimpleXMLElement("<?xml version=\"1.0\"?><$rootNode></$rootNode>");
        $this->arrayToXml($data, $xml);
        
        header('Content-Type: text/xml');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $xml->asXML();
        exit;
    }

    /**
     * Internal recursive helper for XML conversion
     */
    private function arrayToXml($data, &$xml) {
        foreach ($data as $key => $value) {
            if (is_numeric($key)) {
                $key = "item" . $key;
            }
            if (is_array($value)) {
                $subnode = $xml->addChild($key);
                $this->arrayToXml($value, $subnode);
            } else {
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }

    /**
     * Generate printable text summary of detailed entity findings
     */
    public function toTxtReport($title, $overview, $dataItems) {
        $report = "--- Platform Report: " . strtoupper($title) . " ---\n";
        $report .= "Date: " . date('Y-m-d H:i:s') . "\n";
        $report .= "Overview: " . $overview . "\n";
        $report .= str_repeat("-", 40) . "\n\n";

        foreach ($dataItems as $item) {
            foreach ($item as $field => $val) {
                $report .= str_pad(ucfirst($field), 20) . ": " . $val . "\n";
            }
            $report .= "\n";
        }
        
        return $report;
    }
}
?>
