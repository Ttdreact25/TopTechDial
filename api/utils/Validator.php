<?php
/**
 * MIT License
 * Copyright (c) 2024 TopTechDial
 */

class Validator {
    private $errors = [];

    public function validate($data, $rules) {
        $this->errors = [];
        
        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $ruleArray = explode('|', $fieldRules);
            
            foreach ($ruleArray as $rule) {
                $this->applyRule($field, $value, $rule);
            }
        }
        
        return empty($this->errors);
    }

    private function applyRule($field, $value, $rule) {
        if ($rule === 'required') {
            if ($value === null || $value === '' || (is_array($value) && empty($value))) {
                $this->addError($field, "The $field field is required.");
            }
        } elseif ($rule === 'email') {
            if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $this->addError($field, "The $field must be a valid email address.");
            }
        } elseif (strpos($rule, 'min:') === 0) {
            $min = (int) substr($rule, 4);
            if ($value && strlen($value) < $min) {
                $this->addError($field, "The $field must be at least $min characters long.");
            }
        } elseif (strpos($rule, 'max:') === 0) {
            $max = (int) substr($rule, 4);
            if ($value && strlen($value) > $max) {
                $this->addError($field, "The $field must be no more than $max characters long.");
            }
        } elseif ($rule === 'numeric') {
            if ($value && !is_numeric($value)) {
                $this->addError($field, "The $field must be a numeric value.");
            }
        } elseif ($rule === 'phone') {
            // Basic phone validation (e.g. +xxxxxxxxxxx)
            if ($value && !preg_match("/^[0-9+ ]+$/", $value)) {
                $this->addError($field, "The $field must be a valid phone number.");
            }
        } elseif ($rule === 'url') {
            if ($value && !filter_var($value, FILTER_VALIDATE_URL)) {
                $this->addError($field, "The $field must be a valid URL.");
            }
        }
    }

    private function addError($field, $message) {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = [];
        }
        $this->errors[$field][] = $message;
    }

    public function getErrors() {
        return $this->errors;
    }

    public function getFirstError() {
        if (empty($this->errors)) return null;
        $firstField = array_key_first($this->errors);
        return $this->errors[$firstField][0];
    }
}
?>
