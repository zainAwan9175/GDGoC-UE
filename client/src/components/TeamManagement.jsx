import React, { useState, useEffect } from "react";
import { Plus, Trash2, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import Image from "next/image";

const TeamManagement = ({ handleDragOver, handleDragLeave, handleDrop, isDragging, googleColors }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: "", success: false });

  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    image: null,
    linkedin: "",
    github: "",
    level: 1,
  });

  // Upload image to Firebase
  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    const imageRef = ref(storage, `teammember/${file.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotification({ visible: true, message: "Image upload failed.", success: false });
      return null;
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewMember({ ...newMember, image: file });
    }
  };

  // API call to add a new team member
  const putData = async (data) => {
    try {
      const response = await axios.post("https://gd-go-c-ue.vercel.app/team/createmember", data);
      console.log(response.data);
      setNotification({ visible: true, message: "Member created successfully", success: true });
      fetchTeam();
    } catch (error) {
      console.error("Error adding member:", error);
      setNotification({ visible: true, message: "Something went wrong", success: false });
    }
  };

  // Add new team member
  const addTeamMember = async () => {
    if (newMember.image) {
      const url = await uploadImageToFirebase(newMember.image);
      if (url) {
        const memberData = { ...newMember, image: url };
        putData(memberData);
        setNewMember({
          name: "",
          position: "",
          image: null,
          linkedin: "",
          github: "",
          level: 1,
        });
      }
    } else {
      setNotification({ visible: true, message: "Please upload an image.", success: false });
    }
  };

  // Fetch team members
  const fetchTeam = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://gd-go-c-ue.vercel.app/team/getallmembers");
      setTeamMembers(response.data.Team || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove team member
  const removeTeamMember = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`https://gd-go-c-ue.vercel.app/team/deletemember/${id}`);
      if (response.data.Member) {
        fetchTeam();
      } else {
        console.log("Member not found");
      }
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ ...notification, visible: false });
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {notification.visible && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-4 mt-4 rounded-md shadow-md ${
            notification.success ? "bg-green-200" : "bg-red-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm">{notification.message}</p>
            <button onClick={closeNotification} className="text-gray-600">
              &times;
            </button>
          </div>
        </div>
      )}
      <Card className="mb-8 ">
        <CardHeader>
          <CardTitle style={{ color: googleColors.blue }}>Add Team Member</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Input
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <Input
            placeholder="Position"
            value={newMember.position}
            onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
              isDragging ? "border-blue-500" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, "member")}
            onClick={() => document.getElementById("memberFileInput").click()}
          >
            {newMember.image ? (
              <Image
                src={URL.createObjectURL(newMember.image) || "/placeholder.svg"}
                alt="Preview"
                width={128}
                height={128}
                className="max-h-32 mx-auto"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ArrowUp className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm">Drag and drop an image or click to select</p>
              </div>
            )}
            <input
              id="memberFileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
          <Input
            placeholder="LinkedIn URL"
            value={newMember.linkedin}
            onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
          />
          <Input
            placeholder="GitHub URL"
            value={newMember.github}
            onChange={(e) => setNewMember({ ...newMember, github: e.target.value })}
          />
          <Select
            onValueChange={(value) => setNewMember({ ...newMember, level: Number(value) })}
            defaultValue={newMember.level.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTeamMember} style={{ backgroundColor: googleColors.blue, color: "white" }}>
            <Plus className="mr-2" /> Add Team Member
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle style={{ color: googleColors.blue }}>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.map((member, index) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-4 rounded-lg shadow"
              style={{ borderLeft: `4px solid ${Object.values(googleColors)[index % 4]}` }}
            >
              <div className="flex items-center">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => removeTeamMember(member._id)}
                style={{ backgroundColor: googleColors.red }}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
