import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import {
  FaUpload,
  FaTrash,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaFileWord,
  FaFileExcel,
  FaFileArchive,
  FaSpinner
} from "react-icons/fa";
import axios from "axios";

const CreateTicketForm = ({
  companies = [],
  departments = [],
  onSubmit,
  onCancel,
  loading = false,
}) => {

  const { API_URL } = useAuth();

  /* -------------------------------------------------- */
  /* NORMALIZE DATA (Fix for Company not showing) */
  /* -------------------------------------------------- */

  const companiesList = Array.isArray(companies)
    ? companies
    : companies?.companies || companies?.data || [];

  const departmentsList = Array.isArray(departments)
    ? departments
    : departments?.departments || departments?.data || [];

  /* -------------------------------------------------- */
  /* STATE */
  /* -------------------------------------------------- */

  const [formData, setFormData] = useState({
    companyId: "",
    userId: "",
    departmentId: "",
    title: "",
    description: "",
    priority: "medium",
    category: "",
    reason: "",
  });

  const [companyUsers, setCompanyUsers] = useState([]);
  const [departmentCategories, setDepartmentCategories] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingPriorities, setLoadingPriorities] = useState(false);

  /* -------------------------------------------------- */
  /* FETCH PRIORITIES */
  /* -------------------------------------------------- */

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setLoadingPriorities(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/priorities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPriorities(res.data || []);
      } catch (err) {
        console.error("Priority fetch error", err);
      } finally {
        setLoadingPriorities(false);
      }
    };

    fetchPriorities();
  }, [API_URL]);

  /* -------------------------------------------------- */
  /* FETCH USERS WHEN COMPANY CHANGES */
  /* -------------------------------------------------- */

  useEffect(() => {
    const fetchUsers = async () => {
      if (!formData.companyId) {
        setCompanyUsers([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/users?companyId=${formData.companyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        let users = res.data?.users || res.data?.data || res.data || [];

        users = users.filter((u) => u.role === "user");

        setCompanyUsers(users);

        if (users.length > 0 && !formData.userId) {
          setFormData((prev) => ({
            ...prev,
            userId: users[0]._id,
          }));
        }
      } catch (err) {
        console.error("Users fetch error", err);
      }
    };

    fetchUsers();
  }, [formData.companyId, API_URL]);

  /* -------------------------------------------------- */
  /* FETCH CATEGORIES */
  /* -------------------------------------------------- */

  useEffect(() => {
    const fetchCategories = async () => {
      if (!formData.departmentId) {
        setDepartmentCategories([]);
        return;
      }

      const dept = departmentsList.find(
        (d) => d._id === formData.departmentId
      );

      if (dept?.categories) {
        setDepartmentCategories(dept.categories);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/departments/${formData.departmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const categories =
          res.data?.categories ||
          res.data?.data?.categories ||
          [];

        setDepartmentCategories(categories);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };

    fetchCategories();
  }, [formData.departmentId, departmentsList, API_URL]);

  /* -------------------------------------------------- */
  /* FORM HANDLER */
  /* -------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "companyId") {
      setFormData((prev) => ({ ...prev, userId: "" }));
    }

    if (name === "departmentId") {
      setFormData((prev) => ({ ...prev, category: "" }));
    }
  };

  /* -------------------------------------------------- */
  /* FILE UPLOAD */
  /* -------------------------------------------------- */

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  /* -------------------------------------------------- */
  /* FILE ICON */
  /* -------------------------------------------------- */

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();

    if (ext === "pdf") return <FaFilePdf className="text-red-400" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <FaFileImage className="text-green-400" />;
    if (["doc", "docx"].includes(ext))
      return <FaFileWord className="text-blue-400" />;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <FaFileExcel className="text-green-400" />;
    if (["zip", "rar"].includes(ext))
      return <FaFileArchive className="text-yellow-400" />;

    return <FaFileAlt className="text-gray-400" />;
  };

  /* -------------------------------------------------- */
  /* SUBMIT */
  /* -------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.companyId ||
      !formData.userId ||
      !formData.departmentId ||
      !formData.title ||
      !formData.description
    ) {
      alert("Please fill required fields");
      return;
    }

    try {
      setUploading(true);

      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      form.append("department", formData.departmentId);
      form.append("createdBy", formData.userId);

      attachments.forEach((a) => {
        form.append("attachments", a.file);
      });

      await onSubmit(form);

      setFormData({
        companyId: "",
        userId: "",
        departmentId: "",
        title: "",
        description: "",
        priority: "medium",
        category: "",
        reason: "",
      });

      setAttachments([]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* -------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* COMPANY */}
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          Company *
        </label>

        <select
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-white"
        >
          <option value="">Select Company</option>

          {companiesList.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* USER */}
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          User *
        </label>

        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-white"
        >
          <option value="">Select User</option>

          {companyUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* TITLE */}
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          Title *
        </label>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-white"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          Description *
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-white"
        />
      </div>

      {/* ATTACHMENTS */}
      <div>
        <label className="text-white/70 text-sm mb-2 block">
          Attachments
        </label>

        <input
          type="file"
          multiple
          onChange={handleFileUpload}
        />

        {attachments.map((file) => (
          <div key={file.id} className="flex items-center gap-3 mt-2">

            {getFileIcon(file.name)}

            <span className="text-white text-sm">
              {file.name}
            </span>

            <button
              type="button"
              onClick={() => removeAttachment(file.id)}
            >
              <FaTrash className="text-red-400" />
            </button>

          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">

        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}

        <Button type="submit" variant="primary" disabled={uploading}>
          {uploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Create Ticket"
          )}
        </Button>

      </div>

    </form>
  );
};

export default CreateTicketForm;