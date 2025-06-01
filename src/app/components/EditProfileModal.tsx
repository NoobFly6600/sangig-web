import React from "react";
import { Button, Modal } from "antd";

type UserProfile = {
  name?: string;
  about?: string;
  skills?: string;
  education?: string;
  experience?: string;
};

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (formData: Partial<UserProfile>) => void; // Accept partial data without id
  userProfile: UserProfile | null;
};
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSave,
  userProfile,
}) => {
  const [formData, setFormData] = React.useState<UserProfile>(
    userProfile || {}
  );

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOk = () => {
    onSave(formData);
  };

  return (
    <Modal open={visible} onCancel={onClose} title="Edit Profile" footer={null}>
      {["name", "about", "skills", "education", "experience"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-semibold capitalize mb-1">{field}</label>
          <textarea
            className="w-full [border-width:1.5px] border-gray-300 rounded-md p-2 text-base focus:outline-none focus:[border-width:1.5px] focus:border-[#50C878]"
            value={formData[field as keyof UserProfile] || ""}
            onChange={(e) =>
              handleChange(field as keyof UserProfile, e.target.value)
            }
            rows={field === "name" ? 1 : 3}
            maxLength={
              field === "name"
                ? 50
                : field === "about"
                ? 300
                : field === "skills"
                ? 200
                : field === "education"
                ? 200
                : field === "experience"
                ? 300
                : undefined
            }
          />
        </div>
      ))}

      {/* Buttons container */}
      <div className="text-right mt-6">
        <button
          onClick={onClose}
          className="mr-2 cursor-pointer text-lg px-4 py-1 border text-gray-400 border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleOk}
          className="bg-[#50C878] text-lg cursor-pointer text-white px-4 py-1 rounded-md hover:bg-[#3fa963] transition"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
