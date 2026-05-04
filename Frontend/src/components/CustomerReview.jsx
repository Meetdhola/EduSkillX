import React from 'react';

// Icons (reused with new meanings)
const StudentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 9.29L4.74 8.13 12 4.71l7.26 3.42L12 11.29zM6 18v2h12v-2c0-2.67-5.33-4-6-4s-6 1.33-6 4z" fill="#00CFC1"/>
  </svg>
);

const InstructorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" fill="#007B8A"/>
  </svg>
);

const AIFeedbackIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M21 6h-2V4c0-1.1-.9-2-2-2H7C5.9 2 5 2.9 5 4v2H3c-1.1 0-2 .9-2 2v12l4-4h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM7 4h10v2H7V4z" fill="#FFC857"/>
  </svg>
);

const CustomerReview = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Inter] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 shadow-md px-8 py-4 flex items-center justify-between rounded-b-2xl">
        <div className="font-extrabold text-2xl text-[#0D3B66] tracking-tight select-none">EduSkillX</div>
        <nav>
          <ul className="flex gap-8 text-[#0D3B66] font-semibold">
            <li><a href="/" className="hover:text-[#00CFC1] transition">Home</a></li>
            <li><a href="/courses" className="hover:text-[#00CFC1] transition">Courses</a></li>
            <li><a href="/Review" className="hover:text-[#00CFC1] transition">Reviews</a></li>
            <li><a href="/dashboard" className="hover:text-[#00CFC1] transition">DashBoard</a></li>
            <li><a href="/contact" className="hover:text-[#00CFC1] transition">Contact</a></li>
          </ul>
        </nav>
        <div className="flex gap-2">
          <button className="px-5 py-2 rounded-xl font-semibold bg-[#F0F4F8] text-[#0D3B66] shadow hover:bg-[#E5F9F7] transition">Login</button>
          <button className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition">Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-[#00CFC1]/10 to-[#007B8A]/5 rounded-2xl mt-8 mb-8 mx-4 shadow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D3B66] mb-4 drop-shadow-lg">See What Our Students and Instructors Are Saying</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
          <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition">Share Your Review</button>
          <button className="px-6 py-3 rounded-xl font-semibold bg-[#F0F4F8] text-[#0D3B66] shadow hover:bg-[#E5F9F7] transition">Read More Reviews</button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-5xl mx-auto w-full mb-16">
        <h2 className="text-2xl font-bold text-[#0D3B66] mb-8 text-center">Reviews from Our Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-xl transition group border border-transparent hover:border-[#00CFC1] relative">
            <div className="mb-4">
              <StudentIcon />
            </div>
            <h3 className="font-semibold text-lg text-[#007B8A] mb-2">Student Reviews</h3>
            <p className="text-gray-600 text-center">"EduSkillX helped me visualize tough concepts using AR/VR. Learning feels like gaming!"<br /><span className="text-[#00CFC1] font-semibold">– Priya, Computer Science Student</span></p>
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300" style={{boxShadow: '0 0 32px 0 #00CFC155'}} />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-xl transition group border border-transparent hover:border-[#FFC857] relative">
            <div className="mb-4">
              <InstructorIcon />
            </div>
            <h3 className="font-semibold text-lg text-[#FFC857] mb-2">Instructor Feedback</h3>
            <p className="text-gray-600 text-center">"AI Tutor is a game-changer. It assists learners efficiently and boosts engagement."<br /><span className="text-[#FFC857] font-semibold">– Dr. Mehta, Machine Learning Professor</span></p>
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300" style={{boxShadow: '0 0 32px 0 #FFC85755'}} />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center hover:shadow-xl transition group border border-transparent hover:border-[#007B8A] relative">
            <div className="mb-4">
              <AIFeedbackIcon />
            </div>
            <h3 className="font-semibold text-lg text-[#007B8A] mb-2">AI Tutor Experience</h3>
            <p className="text-gray-600 text-center">"The tutor resolved my coding doubts in seconds. It’s like having a personal mentor!"<br /><span className="text-[#007B8A] font-semibold">– Rahul, Final Year IT Student</span></p>
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300" style={{boxShadow: '0 0 32px 0 #007B8A55'}} />
          </div>
        </div>
      </section>

      {/* Newsletter & Footer */}
      <footer className="bg-white/80 rounded-t-2xl shadow-inner px-8 py-10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="font-extrabold text-2xl text-[#0D3B66] mb-2">EduSkillX</div>
            <p className="text-gray-500 max-w-xs mb-4">Transform your learning journey with real feedback from students and instructors alike.</p>
            <div className="flex gap-4">
              <a href="#twitter" aria-label="Twitter" className="text-[#00CFC1] hover:text-[#007B8A] transition"><i className="icon-twitter text-2xl" /></a>
              <a href="#facebook" aria-label="Facebook" className="text-[#007B8A] hover:text-[#00CFC1] transition"><i className="icon-facebook text-2xl" /></a>
              <a href="#instagram" aria-label="Instagram" className="text-[#FFC857] hover:text-[#007B8A] transition"><i className="icon-instagram text-2xl" /></a>
              <a href="#linkedin" aria-label="LinkedIn" className="text-[#0D3B66] hover:text-[#00CFC1] transition"><i className="icon-linkedin text-2xl" /></a>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="font-semibold text-[#0D3B66] mb-2">Subscribe to Our Newsletter</h3>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" aria-label="Email for newsletter"
                className="px-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#00CFC1] bg-[#F9FAFB] text-[#0D3B66]"/>
              <button className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-[#00CFC1] to-[#007B8A] text-white shadow hover:scale-105 hover:shadow-lg transition">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">© {new Date().getFullYear()} EduSkillX. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default CustomerReview;
