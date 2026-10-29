import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import SearchResults from '../pages/SearchResults';
import TopicDetails from '../pages/TopicDetails';
import Bookmarks from '../pages/Bookmarks';

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/topic/:topic" element={<TopicDetails />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </Layout>
  );
}
