export type SiteSettings = {
  hero_headline: string;
  company_intro: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  address: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_branch_code: string;
  google_maps_embed_url: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
};

export type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  author_name: string;
  category: string;
  published_at: string;
};

export type BlogPostDetail = BlogPostSummary & {
  body: string;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string | null;
  rating: number;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  order: number;
};

export type Milestone = {
  id: number;
  year: number;
  title: string;
  description: string;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: "investments" | "registration" | "security" | "withdrawals" | "support";
};

export type InvestmentProduct = {
  id: number;
  category: "property" | "portfolio" | "wealth" | "advisory" | "business_funding" | "future";
  name: string;
  slug: string;
  summary: string;
  description: string;
  min_amount: string;
  expected_return_rate: string;
  term_months: number;
  is_active: boolean;
};

export type Investment = {
  id: number;
  product: InvestmentProduct;
  amount: string;
  status: "active" | "matured" | "cancelled";
  start_date: string;
  maturity_date: string;
  created_at: string;
};

export type PortfolioSummary = {
  total_value: string;
  available_cash: string;
  active_investment_count: number;
  snapshots: { date: string; total_value: string }[];
};

export type Deposit = {
  id: number;
  amount: string;
  method: "paystack" | "bank_transfer" | "crypto";
  status: "pending" | "completed" | "failed";
  reference: string;
  notes: string;
  created_at: string;
};

export type Withdrawal = {
  id: number;
  amount: string;
  method: "bank_transfer" | "crypto";
  status: "pending" | "approved" | "rejected" | "paid";
  bank_details: string;
  admin_notes: string;
  created_at: string;
  processed_at: string | null;
};

export type Earning = {
  id: number;
  amount: string;
  description: string;
  investment: number | null;
  created_at: string;
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  notif_type: "account" | "deposit" | "withdrawal" | "earning" | "announcement";
  is_read: boolean;
  created_at: string;
};

export type InvestorProfile = {
  phone: string;
  date_of_birth: string | null;
  address: string;
  id_number: string;
  risk_profile: "conservative" | "balanced" | "aggressive";
  verification_status: "pending" | "verified" | "rejected";
  verification_notes: string;
  created_at: string;
  updated_at: string;
};

export type Me = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined: string;
};

export type Profile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  profile: InvestorProfile;
};

export type ChatMessage = {
  id: number;
  sender_role: "investor" | "admin";
  body: string;
  is_read: boolean;
  created_at: string;
};

export type AdminStats = {
  total_users: number;
  pending_verifications: number;
  total_deposits_amount: string;
  pending_withdrawals_count: number;
  pending_withdrawals_amount: string;
  active_investments: number;
  unread_contact_messages: number;
  newsletter_subscribers: number;
};

export type ChatThread = {
  id: number;
  is_closed: boolean;
  created_at: string;
  messages: ChatMessage[];
};
