import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
import { createJobFindingPost } from "../../api/JobSeeker";

const PostJob: React.FC = () => {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [workDays, setWorkDays] = useState("จันทร์ - ศุกร์");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("15:00");
  const [successMessage, setSuccessMessage] = useState("");
  const [jobPostType, setJobPostType] = useState<
    "FULLTIME" | "PARTTIME" | "FREELANCE"
  >("FULLTIME");

  const workDayOptions = [
    "จันทร์ - ศุกร์",
    "จันทร์ - เสาร์",
    "จันทร์ - อาทิตย์",
    "เสาร์ - อาทิตย์",
    "อื่นๆ",
  ];

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        times.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      }
    }
    return times;
  };

  const jobPostTypeOptions = ["FULLTIME", "PARTTIME", "FREELANCE"];

  const validateInputs = () => {
    if (
      !jobTitle.trim() ||
      !location.trim() ||
      !jobDescription.trim() ||
      !requirements.trim() ||
      !salary.trim()
    ) {
      alert("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง!");
      return false;
    }
    if (isNaN(Number(salary)) || Number(salary) <= 0) {
      alert("⚠️ กรุณากรอกเงินเดือนเป็นตัวเลขที่มากกว่า 0!");
      return false;
    }
    if (startTime >= endTime) {
      alert("⚠️ เวลาเริ่มงานต้องน้อยกว่าเวลาเลิกงาน!");
      return false;
    }
    return true;
  };

  const handlePostJob = async () => {
    if (!validateInputs()) return;

    const newJob = {
      title: jobTitle,
      description: jobDescription,
      jobLocation: location,
      expectedSalary: Number(salary),
      workDates: workDays,
      workHoursRange: `${startTime} - ${endTime}`,
      jobPostType: jobPostType,
      jobSeekerType: "NORMAL",
      skills: ["539e6449-e6d0-496f-8857-92117048f33f"],
      jobCategories: ["f8a8802e-f7d9-4e2f-be3c-58dd5d225121"],
    };

    try {
      const response = await createJobFindingPost(newJob as any);
      if (response.success) {
        setSuccessMessage("🎉 ประกาศงานสำเร็จแล้ว!");
        setTimeout(() => navigate("/find"), 300);
      } else {
        alert(`⚠️ ${response.msg}`);
      }
    } catch (error) {
      console.error("Error creating job post:", error);
      alert("⚠️ เกิดข้อผิดพลาดในการประกาศงาน!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start bg-gray-50 font-kanit">
      <Navbar />

      <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg w-full mt-5 pt-0">
        <h1 className="text-2xl font-bold text-center text-gray-800 mt-5">
          โพสต์งาน
        </h1>

        {successMessage && (
          <p className="text-green-600 font-kanit text-center">
            {successMessage}
          </p>
        )}

        <form className="space-y-3">
          {[
            {
              label: "ชื่อตำแหน่งงาน",
              value: jobTitle,
              setValue: setJobTitle,
              placeholder: "เช่น Developer, Designer",
            },
            {
              label: "สถานที่ทำงาน",
              value: location,
              setValue: setLocation,
              placeholder: "เช่น กรุงเทพฯ, ทำงานทางไกล",
            },
            {
              label: "เงินเดือน (บาท)",
              value: salary,
              setValue: setSalary,
              placeholder: "เช่น 30000",
              type: "number",
              step: "1000",
            },
          ].map(
            ({ label, value, setValue, placeholder, type = "text", step }) => (
              <div key={label} className="flex flex-col w-4/5 mx-auto">
                <label className="font-kanit text-gray-700">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  step={step}
                  className="border border-gray-300 p-2 rounded-md text-sm"
                />
              </div>
            )
          )}

          <div className="flex flex-col w-4/5 mx-auto">
            <label className="font-kanit text-gray-700">ประเภทงาน</label>
            <select
              value={jobPostType}
              onChange={(e) =>
                setJobPostType(
                  e.target.value as "FULLTIME" | "PARTTIME" | "FREELANCE"
                )
              }
              className="border border-gray-300 p-2 rounded-md text-sm"
            >
              {jobPostTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-4/5 mx-auto">
            <label className="font-kanit text-gray-700">วันทำงาน</label>
            <select
              value={workDays}
              onChange={(e) => setWorkDays(e.target.value)}
              className="border border-gray-300 p-2 rounded-md text-sm"
            >
              {workDayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 w-4/5 mx-auto">
            <div className="flex flex-col">
              <label className="font-kanit text-gray-700">เวลาเริ่มงาน</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-sm w-20"
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-kanit text-gray-700">เวลาเลิกงาน</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md text-sm w-20"
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {[
            {
              label: "รายละเอียดงาน",
              value: jobDescription,
              setValue: setJobDescription,
            },
            {
              label: "คุณสมบัติที่ต้องการ",
              value: requirements,
              setValue: setRequirements,
            },
          ].map(({ label, value, setValue }) => (
            <div key={label} className="flex flex-col w-4/5 mx-auto">
              <label className="font-kanit text-gray-700">{label}</label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`เพิ่ม${label.toLowerCase()}`}
                className="border border-gray-300 p-2 rounded-md h-12 text-sm"
              />
            </div>
          ))}

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handlePostJob}
              className="w-64 bg-seagreen/80 hover:bg-seagreen text-white py-2 px-4 rounded-lg font-kanit transition text-base text-center"
            >
              โพสต์งาน
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default PostJob;
