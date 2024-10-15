import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  // if(fullname === ""){
  //     throw new ApiError(400,"fullname is required")
  // }

  if (
    [fullName, email, username, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser= await User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  });

  if(existedUser){
    throw new ApiError(409, "Email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;

  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  }

  const avator = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avator){
    throw new ApiError(400, "Avatar file is required");
  }

 const user = await User.create({
    fullName,
    avatar:avator.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()

  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
    
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Register Successfull")
  );
});

export { registerUser };
