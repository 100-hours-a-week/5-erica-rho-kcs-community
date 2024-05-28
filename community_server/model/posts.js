import { checkUserModel } from './users.js'
import path from 'path'
import fs from 'fs'
import { getLocalDateTime } from '../tools/dataUtils.js'
import { posts } from './data.js'

const __dirname = path.resolve()

let postNum = posts.length

//post관련 서비스
//게시물 상세 조회 로직
export const getPostModel = id => {
	const postIndex = posts.findIndex(post => post.postId === id && post.deleted_at === null)
	if (postIndex === -1) return null
	posts[postIndex].view += 1
	const post = posts.find(post => post.postId === id && post.deleted_at === null)

	return post
}

export const getMyPostsModel = userId => {
	return posts.filter(post => post.userId === userId && post.deleted_at === null).reverse()
}

export const getOtherPostsModel = () => {
	return posts.filter(post => post.type === 'other' && post.deleted_at === null).reverse()
}

export const getCodingPostsModel = () => {
	return posts.filter(post => post.type === 'coding' && post.deleted_at === null).reverse()
}

export const checkPostOwnerModel = data => {
	const post = getPostModel(data.postId)
	/*
	 * true: 해당 글의 Owner임
	 * fale: 해당 글의 Owner가 아님
	 */
	return post.userId !== data.userId ? false : true
}

export const getPostsModel = () => {
	return posts.filter(post => post.deleted_at === null)
}

//게시물 이미지 저장
//이미지 저장
export const addPostImageModel = image => {
	const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

	if (image.includes('localhost')) {
		return image
	}

	if (!matches || matches.length !== 3) {
		console.log('Wrong Image Type')
		return null
	}

	// 이미지 데이터를 Buffer로 디코딩
	const imageBuffer = Buffer.from(matches[2], 'base64')

	// 이미지를 서버에 저장
	const imageName = `post_image_${Date.now()}.png` // 파일명 생성
	const imagePath = path.join(__dirname, '/images/post', imageName)
	fs.writeFile(imagePath, imageBuffer, err => {
		if (err) {
			console.error('Error saving image:', err)
			return -1
		} else {
			console.log('Image saved successfully')
		}
	})

	const imageUrl = `http://localhost:8000/images/post/${imageName}`
	return imageUrl
}

//게시물 작성 로직
export const addPostModel = data => {
	const user = checkUserModel(data.userId)
	const date = getLocalDateTime()
	const postId = postNum + 1

	const newPost = {
		postId,
		userId: data.userId,
		nickname: user.nickname,
		title: data.title,
		type: data.type,
		content: data.content,
		postImage: data.postImage,
		userImage: user.profile_image,
		created_at: date,
		updated_at: date,
		deleted_at: null,
		view: 0,
		like: 0,
		comment_count: 0
	}
	postNum += 1
	posts.push(newPost)

	return postId
}

//게시물 수정 로직
export const updatePostModel = data => {
	const { id, title, content, postImage, type } = data
	const postIndex = posts.findIndex(post => post.postId === id && post.deleted_at === null)
	if (title) {
		posts[postIndex].title = title
	}

	if (content) {
		posts[postIndex].content = content
	}

	if (postImage) {
		posts[postIndex].postImage = postImage
	}

	if (type) {
		posts[postIndex].type = type
	}

	return posts[postIndex]
}

export const updatePostUserModel = data => {
	const { userId, nickname, profile_image } = data

	const updatedPosts = posts.map(post => {
		if (post.userId === data.userId) {
			return {
				...post,
				userImage: data.profile_image,
				nickname: data.nickname
			}
		}
	})

	return
}

//게시물 삭제 로직
export const deletePostModel = id => {
	const date = getLocalDateTime()
	posts[id - 1].deleted_at = date
	return true
}
