import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import messagePage from "../pages/messages";

export function useGoMessage() {
  const navigate = useNavigate();
  return () => navigate("/messagePage");
}

export function useCreatePost() {
  const navigate = useNavigate();
  return () => navigate("/createPost");
}

export function useGoProfile(userId) {
  const navigate = useNavigate();
  return () => navigate(`/profile/${userId}`);
}

export function popNotifications() {
  return () => {
    console.log("Show notifications popup");
  };
}