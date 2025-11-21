import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../supabaseClient';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

interface Noticia {
  id: number;
  diario: string;
  titulo: string;
  fecha: string;
  enlace: string;
  contenido: string;
  autor: string;
  categoria: string;
  imagen_url: string;
  descripcion: string;
  lugar: string;
}

@Component({
  selector: 'app-noticiass',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Estilos para SweetAlert2 */
    :host ::ng-deep .animated-popup {
      animation: slideInDown 0.3s ease-out !important;
      border-radius: 20px !important;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    }

    :host ::ng-deep .popup-title {
      color: #0ea5e9 !important;
      font-weight: 700 !important;
      font-size: 1.5rem !important;
    }

    :host ::ng-deep .popup-content {
      padding: 1rem !important;
    }

    :host ::ng-deep .swal2-icon.swal2-info {
      border-color: #0ea5e9 !important;
      color: #0ea5e9 !important;
    }

    :host ::ng-deep .swal2-icon.swal2-success {
      border-color: #10b981 !important;
      color: #10b981 !important;
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(20px);
      background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%);
      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(to right, #fff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }

    .header-info {
      display: flex;
      gap: 0.875rem;
      align-items: center;
      color: white;
      font-weight: 500;
    }

    .date {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .time {
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: rgba(255, 255, 255, 0.95);
      color: #0ea5e9;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .login-btn:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.4);
    }

    .login-btn svg {
      width: 18px;
      height: 18px;
    }

    .plans-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .plans-btn:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5);
    }

    .plans-btn svg {
      width: 18px;
      height: 18px;
    }

    .user-menu-container {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: rgba(255, 255, 255, 0.95);
      color: #0ea5e9;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .user-btn:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.4);
    }

    .user-btn svg {
      width: 18px;
      height: 18px;
    }

    .user-btn.open svg:last-child {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 200px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 0.5rem;
      z-index: 1000;
      animation: slideDown 0.3s ease-out;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }

    .user-dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #1f2937;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }

    .user-dropdown-item:hover {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #dc2626;
    }

    .user-dropdown-item svg {
      width: 18px;
      height: 18px;
    }

    .hero {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      padding: 0.875rem 2rem 1.25rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-inner {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 0.5rem;
    }

    .hero-inner::-webkit-scrollbar {
      display: none;
    }

    .nav {
      display: flex;
      gap: 0.625rem;
      flex-shrink: 0;
    }

    .category-btn {
      display: flex;
      align-items: center;
      padding: 0.45rem 1.1rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .category-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .category-btn:hover::before {
      left: 100%;
    }

    .category-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .category-btn.active {
      background: white;
      color: #0ea5e9;
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .dropdown-container {
      position: relative;
    }

    .dropdown-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1.1rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
    }

    .dropdown-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .dropdown-btn.active {
      background: white;
      color: #0ea5e9;
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
    }

    .dropdown-btn svg {
      width: 14px;
      height: 14px;
      transition: transform 0.3s;
    }

    .dropdown-btn.open svg {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: fixed;
      top: auto;
      left: auto;
      min-width: 240px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 0.5rem;
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
      animation: slideDown 0.3s ease-out;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-menu::-webkit-scrollbar {
      width: 6px;
    }

    .dropdown-menu::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .dropdown-menu::-webkit-scrollbar-thumb {
      background: #0ea5e9;
      border-radius: 10px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0.875rem;
      color: #1f2937;
      font-size: 0.85rem;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: linear-gradient(135deg, #e0f2fe, #dbeafe);
      color: #0ea5e9;
      transform: translateX(4px);
    }

    .dropdown-item.active {
      background: linear-gradient(135deg, #0ea5e9, #06b6d4);
      color: white;
      font-weight: 600;
    }

    .dropdown-item svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .dropdown-badge {
      margin-left: auto;
      background: rgba(14, 165, 233, 0.1);
      color: #0ea5e9;
      padding: 0.15rem 0.5rem;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .dropdown-item.active .dropdown-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .search-container {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;
    }

    .search-pill {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.625rem 1.25rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 30px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 250px;
    }

    .search-pill:focus-within {
      background: white;
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
      transform: translateY(-2px);
    }

    .search-pill svg {
      color: #0ea5e9;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }

    .search-pill input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.875rem;
      color: #1f2937;
      font-weight: 500;
    }

    .search-pill input::placeholder {
      color: #9ca3af;
    }

    .refresh-btn {
      padding: 0.625rem;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .refresh-btn:hover:not(:disabled) {
      background: white;
      transform: rotate(180deg) scale(1.1);
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
    }

    .refresh-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .refresh-btn svg {
      color: #0ea5e9;
      width: 16px;
      height: 16px;
    }

    .download-btn {
      padding: 0.625rem;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .download-btn:hover:not(:disabled) {
      background: white;
      transform: translateY(-2px) scale(1.1);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    }

    .download-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .download-btn svg {
      color: #10b981;
      width: 16px;
      height: 16px;
    }

    @keyframes downloadPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .download-btn.downloading {
      animation: downloadPulse 1s ease-in-out infinite;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    .latest-section {
      padding: 2rem 0;
      background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
    }

    .section-header {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem 1rem;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 700;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.25rem;
    }

    .section-subtitle {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .latest-strip {
      display: flex;
      gap: 1.25rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding: 0.5rem 2rem 1.5rem;
      scrollbar-width: thin;
      scrollbar-color: #d1d5db transparent;
      max-width: 1400px;
      margin: 0 auto;
    }

    .latest-strip::-webkit-scrollbar {
      height: 8px;
    }

    .latest-strip::-webkit-scrollbar-track {
      background: transparent;
    }

    .latest-strip::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;
    }

    .latest-strip::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    .latest-card {
      flex: 0 0 260px;
      scroll-snap-align: start;
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      animation: slideIn 0.5s ease-out;
      position: relative;
    }

    .latest-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(14, 165, 233, 0.2);
    }

    .latest-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .latest-card:hover::after {
      transform: scaleX(1);
    }

    .latest-image {
      position: relative;
      width: 100%;
      height: 145px;
      overflow: hidden;
      background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
    }

    .latest-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .latest-card:hover .latest-image img {
      transform: scale(1.1);
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: rgba(255, 255, 255, 0.6);
    }

    .latest-content {
      padding: 1rem;
    }

    .title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1.4;
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.65rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.5rem;
    }

    .category-badge.deportes {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #dc2626;
    }

    .category-badge.economia {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #1e40af;
    }

    .category-badge.sociedad {
      background: linear-gradient(135deg, #d1fae5, #a7f3d0);
      color: #065f46;
    }

    .category-badge.politica {
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      color: #4338ca;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: #6b7280;
      gap: 0.5rem;
    }

    .read-more-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.35rem 0.75rem;
      background: linear-gradient(135deg, #0ea5e9, #06b6d4);
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 0.7rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .read-more-btn:hover {
      background: linear-gradient(135deg, #0284c7, #0891b2);
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
    }

    .read-more-btn svg {
      width: 12px;
      height: 12px;
    }

    .stats-container {
      max-width: 1400px;
      margin: 2rem auto;
      padding: 0 2rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .stat-card {
      flex: 0 1 auto;
      min-width: 120px;
      max-width: 160px;
      background: white;
      border-radius: 16px;
      padding: 1.5rem 1.25rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      border: 2px solid #e5e7eb;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981);
    }

    .stat-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(16, 185, 129, 0.05));
      opacity: 0;
      transition: opacity 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(14, 165, 233, 0.2);
      border-color: #0ea5e9;
    }

    .stat-card:hover::after {
      opacity: 1;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 0.5rem;
      position: relative;
      z-index: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative;
      z-index: 1;
    }

    .news-section {
      padding: 2rem 0;
      background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
    }

    .news-grid {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }

    .news-card {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      animation: slideIn 0.5s ease-out;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .news-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .news-card:hover::before {
      transform: scaleX(1);
    }

    .news-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(14, 165, 233, 0.2);
    }

    .news-image {
      position: relative;
      width: 100%;
      height: 170px;
      overflow: hidden;
      background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%);
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .news-card:hover .news-image img {
      transform: scale(1.1);
    }

    .news-content {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .desc {
      font-size: 0.85rem;
      color: #4b5563;
      line-height: 1.5;
      margin-bottom: 0.875rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .news-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .footer {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      margin-top: 4rem;
      padding: 3rem 0;
      color: white;
      text-align: center;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-text {
      font-size: 0.95rem;
      opacity: 0.9;
    }

    .empty-state {
      max-width: 600px;
      margin: 4rem auto;
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .empty-text {
      color: #6b7280;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .header-main {
        padding: 1rem;
      }

      .logo {
        font-size: 1.5rem;
      }

      .header-info {
        gap: 0.75rem;
      }

      .date {
        display: none;
      }

      .login-btn {
        padding: 0.4rem 0.9rem;
        font-size: 0.75rem;
      }

      .login-btn svg {
        width: 16px;
        height: 16px;
      }

      .hero {
        padding: 1rem;
      }

      .hero-inner {
        flex-wrap: wrap;
      }

      .nav {
        gap: 0.5rem;
        width: 100%;
      }

      .category-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
      }

      .search-container {
        width: 100%;
        margin-left: 0;
      }

      .search-pill {
        flex: 1;
        min-width: 0;
      }

      .news-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 0 1rem;
      }

      .stats-container {
        padding: 0 1rem;
      }

      .stat-card {
        min-width: 140px;
      }

      .stat-number {
        font-size: 2rem;
      }
    }

    @media (min-width: 769px) and (max-width: 1200px) {
      .news-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="header">
        <div class="header-main">
          <h1 class="logo">NoticiasHoy</h1>
          <div class="header-info">
            <div class="date">{{ today | date:'fullDate' }}</div>
            <div class="time">{{ today | date:'mediumTime' }}</div>

            <!-- Botón de Planes -->
            <button class="plans-btn" (click)="irAPlanes()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Planes
            </button>

            <!-- Botón de Login -->
            <button class="login-btn" (click)="irALogin()" *ngIf="!usuarioActual">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar Sesión
            </button>

            <!-- Menú de Usuario -->
            <div class="user-menu-container" *ngIf="usuarioActual">
              <button class="user-btn" [class.open]="mostrarMenuUsuario" (click)="toggleMenuUsuario()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ nombreUsuario }}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div class="user-dropdown" *ngIf="mostrarMenuUsuario">
                <button class="user-dropdown-item" (click)="cerrarSesion()">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero -->
        <div class="hero">
          <div class="hero-inner">
            <nav class="nav">
              <button class="category-btn" [class.active]="!categoriaSeleccionada && !diarioSeleccionado" (click)="seleccionarCategoria(''); seleccionarDiario('')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Todo
              </button>

              <button class="category-btn deportes" [class.active]="categoriaSeleccionada === 'Deportes'" (click)="seleccionarCategoria('Deportes')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Deportes
              </button>

              <button class="category-btn economia" [class.active]="categoriaSeleccionada === 'Economía'" (click)="seleccionarCategoria('Economía')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Economía
              </button>

              <button class="category-btn sociedad" [class.active]="categoriaSeleccionada === 'Sociedad'" (click)="seleccionarCategoria('Sociedad')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Sociedad
              </button>

              <button class="category-btn politica" [class.active]="categoriaSeleccionada === 'Política'" (click)="seleccionarCategoria('Política')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Política
              </button>

              <div class="dropdown-container">
                <button class="dropdown-btn" [class.active]="diarioSeleccionado" [class.open]="mostrarDropdownDiarios" (click)="toggleDropdownDiarios()">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {{ diarioSeleccionado || 'Seleccionar Diario' }}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div class="dropdown-menu" *ngIf="mostrarDropdownDiarios" [style.top]="dropdownPosition.top" [style.left]="dropdownPosition.left">
                  <button class="dropdown-item" [class.active]="!diarioSeleccionado" (click)="seleccionarDiario('')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Todos los diarios
                    <span class="dropdown-badge">{{ noticias.length }}</span>
                  </button>
                  <button *ngFor="let diario of diarios" class="dropdown-item" [class.active]="diarioSeleccionado === diario" (click)="seleccionarDiario(diario)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ diario }}
                    <span class="dropdown-badge">{{ getNoticiasPorDiario(diario) }}</span>
                  </button>
                </div>
              </div>
            </nav>

            <div class="search-container">
              <div class="search-pill">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Buscar noticias..." [(ngModel)]="busqueda" (input)="filtrarNoticias()" aria-label="Buscar" />
              </div>
              <button class="download-btn" [class.downloading]="descargando" (click)="descargarNoticias()" [disabled]="descargando || noticias.length === 0" title="Descargar noticias en Excel">
                <svg *ngIf="!descargando" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <svg *ngIf="descargando" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
              </button>
              <button class="refresh-btn" (click)="actualizarNoticias()" [disabled]="cargando" title="Actualizar noticias">
                <svg *ngIf="!cargando" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                <svg *ngIf="cargando" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
                  <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Últimas noticias -->
      <section class="latest-section" *ngIf="noticias.length">
        <div class="section-header">
          <h2 class="section-title">🔥 Últimas Noticias</h2>
          <p class="section-subtitle">Las historias más recientes y relevantes del momento</p>
        </div>
        <div class="latest-strip" aria-label="Últimas noticias">
          <div class="latest-card" *ngFor="let n of getNoticiasRecientes()">
            <div class="latest-image">
              <img *ngIf="n.imagen_url && n.imagen_url !== 'Sin imagen'" [src]="n.imagen_url" [alt]="n.titulo" />
              <div *ngIf="!n.imagen_url || n.imagen_url === 'Sin imagen'" class="placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1" />
                </svg>
              </div>
            </div>
            <div class="latest-content">
              <span class="category-badge" [ngClass]="getCategoriaClass(n.categoria)">
                {{ n.categoria }}
              </span>
              <h3 class="title">{{ n.titulo }}</h3>
              <div class="meta">
                <span>{{ formatearFecha(n.fecha) }}</span>
                <a [href]="n.enlace" target="_blank" rel="noopener noreferrer" class="read-more-btn" (click)="$event.stopPropagation()">
                  Ver más
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Estadísticas -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">{{ Math.min(noticiasFiltradas.length, 20) }}</div>
          <div class="stat-label">Mostradas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ noticias.length }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ diarios.length }}</div>
          <div class="stat-label">Diarios</div>
        </div>
        <div class="stat-card" *ngIf="diarioSeleccionado">
          <div class="stat-number">{{ getNoticiasPorDiario(diarioSeleccionado) }}</div>
          <div class="stat-label">{{ diarioSeleccionado }}</div>
        </div>
        <div class="stat-card" *ngIf="categoriaSeleccionada && !diarioSeleccionado">
          <div class="stat-number">{{ getNoticiasPorCategoria(categoriaSeleccionada) }}</div>
          <div class="stat-label">{{ categoriaSeleccionada }}</div>
        </div>
      </div>

      <!-- Grid de noticias -->
      <section class="news-section">
        <div *ngIf="noticiasFiltradas.length === 0" class="empty-state">
          <div class="empty-icon">📰</div>
          <h3 class="empty-title">No hay noticias disponibles</h3>
          <p class="empty-text">Intenta con otra búsqueda o categoría</p>
        </div>
        <div class="news-grid">
          <div *ngFor="let noticia of noticiasFiltradas.slice(0, 20)" class="news-card">
            <div class="news-image">
              <img *ngIf="noticia.imagen_url && noticia.imagen_url !== 'Sin imagen'" [src]="noticia.imagen_url" [alt]="noticia.titulo" />
              <div *ngIf="!noticia.imagen_url || noticia.imagen_url === 'Sin imagen'" class="placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div class="news-content">
              <span class="category-badge" [ngClass]="getCategoriaClass(noticia.categoria)">
                {{ noticia.categoria }}
              </span>
              <h2 class="title">{{noticia.titulo}}</h2>
              <p class="desc">{{noticia.descripcion}}</p>
              <div class="news-footer">
                <div class="meta">
                  <span>{{ formatearFecha(noticia.fecha) }}</span>
                </div>
                <a [href]="noticia.enlace" target="_blank" rel="noopener noreferrer" class="read-more-btn" (click)="$event.stopPropagation()">
                  Ver más
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <p class="footer-text">&copy; 2025 NoticiasHoy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `
})
export class NewsPortalComponent implements OnInit, OnDestroy {
  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  diarios: string[] = [];
  busqueda: string = '';
  categoriaSeleccionada: string = '';
  diarioSeleccionado: string = '';
  today = new Date();
  cargando: boolean = false;
  descargando: boolean = false;
  mostrarDropdownDiarios: boolean = false;
  dropdownPosition = { top: '0px', left: '0px' };

  usuarioActual: any = null;
  nombreUsuario: string = '';
  mostrarMenuUsuario: boolean = false;
  private authSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('ngOnInit ejecutado');
    this.verificarSesion();
    this.cargarNoticias();
    setInterval(() => {
      this.today = new Date();
    }, 1000);

    document.addEventListener('click', (event: any) => {
      const dropdown = document.querySelector('.dropdown-container');
      const userMenu = document.querySelector('.user-menu-container');

      if (dropdown && !dropdown.contains(event.target)) {
        this.mostrarDropdownDiarios = false;
      }

      if (userMenu && !userMenu.contains(event.target)) {
        this.mostrarMenuUsuario = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async verificarSesion() {
    console.log('🔍 Verificando sesión...');

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      this.usuarioActual = session.user;
      const metadata = session.user.user_metadata as any;
      this.nombreUsuario = metadata?.nombre ||
                          metadata?.full_name ||
                          session.user.email?.split('@')[0] ||
                          'Usuario';

      console.log('✅ Usuario autenticado:', this.nombreUsuario);
    } else {
      console.log('❌ No hay sesión activa');
    }

    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Cambio de autenticación:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        this.usuarioActual = session.user;
        const metadata = session.user.user_metadata as any;
        this.nombreUsuario = metadata?.nombre ||
                            metadata?.full_name ||
                            session.user.email?.split('@')[0] ||
                            'Usuario';
        console.log('✅ Usuario conectado:', this.nombreUsuario);
      } else if (event === 'SIGNED_OUT') {
        this.usuarioActual = null;
        this.nombreUsuario = '';
        console.log('👋 Usuario desconectado');
      }
    });
  }

  // Método para verificar autenticación
  private verificarAutenticacion(): boolean {
    if (!this.usuarioActual) {
      Swal.fire({
        title: '¡Acceso Restringido!',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
            <p style="font-size: 1.1rem; color: #4b5563; margin-bottom: 1rem;">
              Esta función está disponible solo para usuarios registrados
            </p>
            <p style="font-size: 0.9rem; color: #6b7280;">
              Inicia sesión para acceder a filtros avanzados y descarga de noticias
            </p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#0ea5e9',
        cancelButtonColor: '#6b7280',
        confirmButtonText: ' Iniciar Sesión',
        cancelButtonText: 'Cancelar',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)',
        customClass: {
          popup: 'animated-popup',
          title: 'popup-title',
          htmlContainer: 'popup-content'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.irALogin();
        }
      });
      return false;
    }
    return true;
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  irAPlanes() {
    this.router.navigate(['/payment/plans']);
  }

  toggleMenuUsuario() {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  async cerrarSesion() {
    try {
      await supabase.auth.signOut();
      this.usuarioActual = null;
      this.nombreUsuario = '';
      this.mostrarMenuUsuario = false;
      console.log('✅ Sesión cerrada exitosamente');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }

  async cargarNoticias() {
    console.log('Cargando noticias desde Supabase...');
    let allData: Noticia[] = [];
    let from = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('noticiass')
        .select('*')
        .order('fecha', { ascending: false })
        .range(from, from + limit - 1);

      if (error) {
        console.error('Error al cargar noticias:', error);
        break;
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += limit;
        hasMore = data.length === limit;
      } else {
        hasMore = false;
      }
    }

    console.log(`Total de noticias cargadas: ${allData.length}`);
    this.noticias = this.ordenarPorFechaDesc(allData);
    this.noticiasFiltradas = [...this.noticias];
    this.obtenerDiarios();
  }

  obtenerDiarios() {
    const todosDiarios = [...new Set(this.noticias.map(noticia => noticia.diario))];
    this.diarios = todosDiarios.filter(diario => diario && diario !== 'Diario no encontrado').sort();
    console.log('Diarios encontrados:', this.diarios);
  }

  filtrarNoticias() {
    // El buscador funciona sin autenticación
    this.noticiasFiltradas = this.noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      noticia.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      noticia.autor.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      noticia.contenido.toLowerCase().includes(this.busqueda.toLowerCase())
    );

    // Solo aplicar filtros si hay autenticación
    if (this.usuarioActual) {
      if (this.categoriaSeleccionada) {
        this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
          noticia.categoria === this.categoriaSeleccionada
        );
      }

      if (this.diarioSeleccionado) {
        this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
          noticia.diario === this.diarioSeleccionado
        );
      }
    }

    this.noticiasFiltradas = this.ordenarPorFechaDesc(this.noticiasFiltradas);
  }

  filtrarPorCategoria() {
    if (this.categoriaSeleccionada) {
      this.noticiasFiltradas = this.noticias.filter(noticia =>
        noticia.categoria === this.categoriaSeleccionada
      );
    } else {
      this.noticiasFiltradas = [...this.noticias];
    }

    if (this.diarioSeleccionado) {
      this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
        noticia.diario === this.diarioSeleccionado
      );
    }

    if (this.busqueda) {
      this.filtrarNoticias();
    }
    this.noticiasFiltradas = this.ordenarPorFechaDesc(this.noticiasFiltradas);
  }

  filtrarPorDiario() {
    if (this.diarioSeleccionado) {
      this.noticiasFiltradas = this.noticias.filter(noticia =>
        noticia.diario === this.diarioSeleccionado
      );
    } else {
      this.noticiasFiltradas = [...this.noticias];
    }

    if (this.categoriaSeleccionada) {
      this.noticiasFiltradas = this.noticiasFiltradas.filter(noticia =>
        noticia.categoria === this.categoriaSeleccionada
      );
    }

    if (this.busqueda) {
      this.filtrarNoticias();
    }
    this.noticiasFiltradas = this.ordenarPorFechaDesc(this.noticiasFiltradas);
  }

  seleccionarCategoria(cat: string) {
    // Permitir "Todo" sin autenticación
    if (cat === '') {
      this.categoriaSeleccionada = cat;
      this.filtrarPorCategoria();
      return;
    }

    // Requiere autenticación para filtros específicos
    if (!this.verificarAutenticacion()) {
      return;
    }

    this.categoriaSeleccionada = cat;
    this.filtrarPorCategoria();
  }

  seleccionarDiario(diario: string) {
    this.diarioSeleccionado = diario;
    this.mostrarDropdownDiarios = false;
    this.filtrarPorDiario();
  }

  toggleDropdownDiarios() {
    // Requiere autenticación
    if (!this.verificarAutenticacion()) {
      return;
    }

    this.mostrarDropdownDiarios = !this.mostrarDropdownDiarios;

    if (this.mostrarDropdownDiarios) {
      setTimeout(() => {
        const button = document.querySelector('.dropdown-btn') as HTMLElement;
        if (button) {
          const rect = button.getBoundingClientRect();
          this.dropdownPosition = {
            top: `${rect.bottom + 8}px`,
            left: `${rect.left}px`
          };
        }
      }, 0);
    }
  }

  getNoticiasPorCategoria(categoria: string): number {
    return this.noticias.filter(noticia => noticia.categoria === categoria).length;
  }

  getNoticiasPorDiario(diario: string): number {
    return this.noticias.filter(noticia => noticia.diario === diario).length;
  }

  getCategoriaClass(categoria: string): string {
    const cat = categoria?.toLowerCase() || '';
    if (cat.includes('deporte')) return 'deportes';
    if (cat.includes('econom')) return 'economia';
    if (cat.includes('sociedad')) return 'sociedad';
    if (cat.includes('polít')) return 'politica';
    return '';
  }

  private ordenarPorFechaDesc(arr: Noticia[]): Noticia[] {
    return [...arr].sort((a, b) => {
      const fechaA = this.esFechaValida(a.fecha) ? new Date(a.fecha).getTime() : 0;
      const fechaB = this.esFechaValida(b.fecha) ? new Date(b.fecha).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  getNoticiasRecientes(): Noticia[] {
    return this.ordenarPorFechaDesc(this.noticias).slice(0, 15);
  }

  get Math() {
    return Math;
  }

  async actualizarNoticias() {
    this.cargando = true;
    console.log('Actualizando noticias...');
    try {
      await this.cargarNoticias();
      this.filtrarPorCategoria();
      console.log('Noticias actualizadas exitosamente');
    } catch (error) {
      console.error('Error al actualizar noticias:', error);
    } finally {
      this.cargando = false;
    }
  }

  esFechaValida(fecha: any): boolean {
    if (!fecha || fecha === 'Fecha no encontrada' || fecha === 'Sin fecha') {
      return false;
    }
    const date = new Date(fecha);
    return date instanceof Date && !isNaN(date.getTime());
  }

  formatearFecha(fecha: any): string {
    if (this.esFechaValida(fecha)) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return fecha || 'Sin fecha';
  }

  descargarNoticias() {
    // Requiere autenticación
    if (!this.verificarAutenticacion()) {
      return;
    }

    this.descargando = true;
    console.log('📥 Iniciando descarga de noticias...');

    try {
      const noticiasParaDescargar = this.noticiasFiltradas.length > 0 ? this.noticiasFiltradas : this.noticias;

      const datosExcel = noticiasParaDescargar.map((noticia, index) => ({
        'N°': index + 1,
        'Título': noticia.titulo,
        'Descripción': noticia.descripcion,
        'Categoría': noticia.categoria,
        'Diario': noticia.diario,
        'Autor': noticia.autor,
        'Lugar': noticia.lugar,
        'Fecha': this.formatearFecha(noticia.fecha),
        'Enlace': noticia.enlace,
        'Imagen URL': noticia.imagen_url
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);

      const columnWidths = [
        { wch: 5 },
        { wch: 50 },
        { wch: 60 },
        { wch: 15 },
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 50 },
        { wch: 50 }
      ];
      ws['!cols'] = columnWidths;

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Noticias');

      const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
      const nombreArchivo = `NoticiasHoy_${fecha}.xlsx`;

      XLSX.writeFile(wb, nombreArchivo);

      console.log(`✅ Descarga completada: ${noticiasParaDescargar.length} noticias`);

      // Mostrar mensaje de éxito
      Swal.fire({
        title: '¡Descarga Exitosa!',
        html: `
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📥</div>
            <p style="font-size: 1rem; color: #10b981;">
              Se descargaron <strong>${noticiasParaDescargar.length}</strong> noticias
            </p>
          </div>
        `,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#fff'
      });

      setTimeout(() => {
        this.descargando = false;
      }, 1000);

    } catch (error) {
      console.error('❌ Error al descargar noticias:', error);
      this.descargando = false;

      Swal.fire({
        title: 'Error',
        text: 'Error al generar el archivo Excel. Por favor intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  }
}
