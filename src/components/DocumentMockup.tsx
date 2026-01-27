import { MessageCircle, Star, BookOpen, Code, Image as ImageIcon, Check, Layers, MoreHorizontal, Share2 } from 'lucide-react';

export function DocumentMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto p-4">
      {/* Main document viewer */}
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* Document header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* User Avatar with CS vibe */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                D
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">OOP & Design Patterns</h2>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                    <Check className="w-3 h-3" />
                    Verified
                  </div>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  Computer Science • Java Core
                  <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                  2 hours ago
                </p>
              </div>
            </div>

            {/* Xu Rewards - visible in header at far right */}
            <div className="bg-white rounded-xl shadow-md border border-orange-100 px-4 py-2.5 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Xu Rewards</p>
                <p className="text-lg font-bold text-gray-900">1,250</p>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 ml-2">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document content (Scrollable area simulation) */}
        <div className="p-8 space-y-6 bg-white">

          {/* Main Title Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Chapter 1</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Tổng quan về Lập trình hướng đối tượng (OOP)
            </h1>
          </div>

          {/* Intro Paragraph */}
          <div className="prose prose-sm text-gray-600 leading-relaxed">
            <p>
              Lập trình hướng đối tượng (OOP) là một mô hình lập trình dựa trên khái niệm "objects",
              chứa đựng dữ liệu dưới dạng trường (fields) và mã nguồn dưới dạng thủ tục (methods).
              Mục tiêu chính là tăng khả năng tái sử dụng mã và quản lý các hệ thống phần mềm lớn.
            </p>
          </div>

          {/* Key Concepts Grid (Visual enhancement) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-900 text-sm mb-1">Encapsulation</h4>
              <p className="text-xs text-indigo-700">Đóng gói dữ liệu, che giấu thông tin chi tiết.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-900 text-sm mb-1">Inheritance</h4>
              <p className="text-xs text-purple-700">Kế thừa thuộc tính từ lớp cha (Parent Class).</p>
            </div>
          </div>

          {/* Diagram Illustration */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center text-center space-y-3">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">UML Class Diagram: Animal Hierarchy</p>
              <p className="text-xs text-gray-500 mt-1">Biểu đồ thể hiện mối quan hệ giữa lớp cha Animal và lớp con Dog/Cat.</p>
            </div>
            {/* Fake diagram blocks */}
            <div className="flex gap-4 mt-2 opacity-50">
              <img
                // Đây là link trực tiếp đến file ảnh (.png)
                src="https://nguyenbinhson.com/wp-content/uploads/2020/09/image-4.png"
                alt="UML Inheritance Diagram"
                // Thêm class để ảnh không bị tràn khung và căn giữa
                className="max-w-full h-auto max-h-48 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Code Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <div className="flex items-center gap-1.5">
                <Code className="w-3 h-3" />
                <span>Example.java</span>
              </div>
              <span>Java</span>
            </div>
            <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-hidden shadow-inner text-xs font-mono leading-relaxed">
              <div className="flex gap-4">
                <div className="flex flex-col text-gray-600 select-none text-right border-r border-gray-700 pr-4">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-purple-400">public class</span> <span className="text-yellow-300">Dog</span> <span className="text-purple-400">extends</span> <span className="text-yellow-300">Animal</span> {'{'}
                  <br />
                  &nbsp;&nbsp;<span className="text-green-400">// Override method</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-blue-400">@Override</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">public void</span> <span className="text-blue-300">makeSound</span>() {'{'}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">System</span>.out.println(<span className="text-orange-300">"Woof woof!"</span>);
                  <br />
                  &nbsp;&nbsp;{'}'}
                  <br />
                  &nbsp;&nbsp;<span className="text-gray-500">/* Additional logic here */</span>
                  <br />
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Comments */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">8 Comments</span>
            </div>
            <button className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0">
                M
              </div>
              <div className="flex-1 bg-white rounded-tr-xl rounded-b-xl px-4 py-3 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-gray-900">Minh Dev</p>
                  <span className="text-[10px] text-gray-400">10m ago</span>
                </div>
                <p className="text-xs text-gray-600">Bài viết rất chi tiết! Bạn có thể giải thích thêm về Polymorphism (Đa hình) ở phần sau không?</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}

      {/* Subject Tag */}
      <div className="absolute top-1/2 -left-3 md:-left-6 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 flex flex-col gap-3">
        <div className="group relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer">
            <BookOpen className="w-4 h-4" />
          </div>
          {/* Tooltip */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Read Mode
          </span>
        </div>
        <div className="w-8 h-8 rounded-md bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-colors cursor-pointer">
          <Share2 className="w-4 h-4" />
        </div>
      </div>

    </div>
  );
}