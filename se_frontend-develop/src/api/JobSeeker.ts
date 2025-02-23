import axios from "axios";
import { backendPort } from "./globalvariable";

interface JobSeekerInfo {
  id: string;
  username: string;
}

interface JobSeekerAuthResponse {
  id: string;
  type: string;
  isOauth: boolean;
}

interface JobFindingPost {
  title: string;
  description: string;
  jobLocation: string;
  expectedSalary: number;
  workDates: string;
  workHoursRange: string;
  jobPostType: "FULLTIME" | "PARTTIME" | "FREELANCE";
  jobSeekerType: "NORMAL" | "OAUTH";
  skills: string[];
  jobCategories: string[];
}

interface JobFindingPostResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    id: string;
    title: string;
    description: string;
    jobLocation: string;
    expectedSalary: number;
    workDates: string;
    workHoursRange: string;
    status: string;
    jobPostType: string;
    jobSeekerType: string;
    jobSeekerId: string;
    oauthJobSeekerId: string | null;
    createdAt: string;
    updatedAt: string;
    skills: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    }[];
    jobCategories: {
      id: string;
      name: string;
      description: string;
    }[];
  };
}

interface JobFindingPostPaginationResponse {
  success: boolean;
  status: number;
  msg: string;
  data: {
    jobPosts: {
      id: string;
      title: string;
      description: string;
      jobLocation: string;
      expectedSalary: number;
      workDates: string;
      workHoursRange: string;
      status: string;
      jobPostType: string;
      jobSeekerType: string;
      jobSeekerId: string;
      oauthJobSeekerId: string | null;
      createdAt: string;
      updatedAt: string;
      skills: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
      }[];
      jobCategories: {
        id: string;
        name: string;
        description: string;
      }[];
    }[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface JobPostDetailResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    jobLocation: string;
    expectedSalary: number;
    workDates: string;
    workHoursRange: string;
    status: string;
    jobPostType: string;
    jobSeekerType: string;
    jobSeekerId: string | null;
    oauthJobSeekerId: string | null;
    createdAt: string;
    updatedAt: string;
    skills: {
      id: string;
      name: string;
      description: string;
    }[];
    jobCategories: {
      id: string;
      name: string;
      description: string;
    }[];
  };
  message: string;
}

export const registerJobSeeker = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ id: string }> => {
  try {
    console.log("Registering job seeker with:", {
      name,
      email,
      password,
      confirmPassword,
    });
    const { data } = await axios.post<{ data: { id: string } }>(
      `http://localhost:${backendPort}/api/user/job-seeker`,
      { name, email, password, confirmPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Registration successful:", data);
    return data.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const loginJobSeeker = async (
  nameEmail: string,
  password: string
): Promise<JobSeekerAuthResponse> => {
  try {
    console.log("Attempting to login job seeker with:", {
      nameEmail,
      password,
    });
    const { data } = await axios.post<{ data: JobSeekerAuthResponse }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
      { nameEmail, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Login successful:", data);
    return data.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logoutJobSeeker = async (): Promise<void> => {
  try {
    console.log("Logging out job seeker...");
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
      {
        withCredentials: true,
      }
    );
    console.log("Logout successful:", data);
    return data.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const fetchJobSeekerInfo = async (): Promise<JobSeekerInfo> => {
  try {
    console.log("Fetching job seeker info...");
    const { data } = await axios.get<{ data: JobSeekerInfo }>(
      `http://localhost:${backendPort}/api/user/job-seeker/auth`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Fetch job seeker info successful:", data);
    return data.data;
  } catch (error) {
    console.error("Fetch job seeker info failed:", (error as any).message);
    throw error;
  }
};

export const createJobFindingPost = async (
  jobFindingPost: JobFindingPost
): Promise<JobFindingPostResponse> => {
  try {
    console.log("Creating job finding post with:", jobFindingPost);
    const { data } = await axios.post<{ data: JobFindingPostResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts`,
      jobFindingPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Job finding post creation successful:", data);
    return data.data;
  } catch (error) {
    console.error("Job finding post creation failed:", error);
    throw error;
  }
};

export const getAllJobFindingPosts = async (
  filters: {
    title?: string;
    provinces?: string[];
    jobCategories?: string[];
    salaryRange?: number;
    sortBy?: "asc" | "desc";
    salarySort?: "high-low" | "low-high";
    page?: number;
  } = {}
): Promise<JobFindingPostPaginationResponse> => {
  try {
    console.log("Fetching all job finding posts with filters:", filters);
    const { data } = await axios.get<JobFindingPostPaginationResponse>(
      `http://localhost:${backendPort}/api/post/finding-posts`,
      {
        params: filters,
        withCredentials: true,
      }
    );
    console.log("Job finding posts fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch job finding posts:", error);
    throw error;
  }
};

export const updateJobFindingPost = async (
  id: string,
  jobFindingPost: JobFindingPost
): Promise<JobFindingPostResponse> => {
  try {
    console.log(
      "Updating job finding post with ID:",
      id,
      "and data:",
      jobFindingPost
    );
    const { data } = await axios.put<{ data: JobFindingPostResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      jobFindingPost,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("Job finding post update successful:", data);
    return data.data;
  } catch (error) {
    console.error("Job finding post update failed:", error);
    throw error;
  }
};

export const deleteJobFindingPost = async (id: string): Promise<void> => {
  try {
    console.log("Deleting job finding post with ID:", id);
    const { data } = await axios.delete<{ data: void }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      {
        withCredentials: true,
      }
    );
    console.log("Job finding post deletion successful:", data);
  } catch (error) {
    console.error("Job finding post deletion failed:", error);
    throw error;
  }
};

export const getJobFindingPostById = async (id: string): Promise<any> => {
  try {
    console.log("Fetching job finding post with ID:", id);
    const { data } = await axios.get<{ data: JobPostDetailResponse }>(
      `http://localhost:${backendPort}/api/post/finding-posts/${id}`,
      {
        withCredentials: true,
      }
    );
    console.log("Job finding post fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch job finding post:", error);
    throw error;
  }
};
