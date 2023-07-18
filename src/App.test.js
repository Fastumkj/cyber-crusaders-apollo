import { cleanup } from "@testing-library/react";
import { auth, db } from "./utils/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

jest.mock("firebase/storage");
jest.mock("firebase/firestore");

const mockGetStorage = jest.fn();
const mockRef = jest.fn();
const mockGetDownloadURL = jest.fn();
const mockCollection = jest.fn();
const mockGetDocs = jest.fn();

const mockCurrentUser = {
  uid: "userId",
  _stopProactiveRefresh: jest.fn(),
};

auth.currentUser = mockCurrentUser;

jest.spyOn(console, "log").mockImplementation(() => {});

beforeEach(() => {
  getStorage.mockReturnValue(mockGetStorage);
  ref.mockReturnValue(mockRef);
  getDownloadURL.mockReturnValue(mockGetDownloadURL);
  collection.mockReturnValue(mockCollection);
  getDocs.mockReturnValue(mockGetDocs);
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test("fetchProfilePic should set photo URL when profile picture exists", async () => {
  // Mock the necessary dependencies
  const mockSetPhoto = jest.fn();
  mockGetDownloadURL.mockResolvedValue("https://example.com/photo.jpg");

  // Define the fetchProfilePic function
  const fetchProfilePic = async (setPhoto) => {
    const storage = getStorage();
    const pic = ref(storage, "images/" + auth.currentUser.uid);
    try {
      const url = await getDownloadURL(pic);
      setPhoto(url);
    } catch (error) {
      console.log("No profile pic found");
    }
  };

  // Call the fetchProfilePic function with the mock dependencies
  await fetchProfilePic(mockSetPhoto);

  // Assert the expected behavior
  expect(mockSetPhoto).toHaveBeenCalledWith("https://example.com/photo.jpg");
});

test("fetchUserName should set name when user document is found", async () => {
  // Mock the necessary dependencies
  const mockSetName = jest.fn();
  mockGetDocs.mockResolvedValue({
    forEach: (callback) =>
      callback({ id: "userId", data: () => ({ name: "John Doe" }) }),
  });

  // Define the fetchUserName function
  const fetchUserName = async (setName) => {
    const username = collection(db, "user");
    const snapshot = await getDocs(username);
    snapshot.forEach((doc) => {
      if (doc.id === auth.currentUser.uid) {
        setName(doc.data().name);
      }
    });
  };

  // Call the fetchUserName function with the mock dependencies
  await fetchUserName(mockSetName);

  // Assert the expected behavior
  expect(mockSetName).toHaveBeenCalledWith("John Doe");
});
