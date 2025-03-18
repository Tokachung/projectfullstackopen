const dummy = (blogs) => {
    return 1
}

const calculateTotalLikes = (blogs) => {
    totalLikes = 0

    blogs.forEach((blog) => {
        console.log("blog is: ", blog)
        for (const [key, value] of Object.entries(blog)) {
            console.log("key is: ", key)
            if (key == "likes") {
                totalLikes += value
            }
        }
    })

    console.log("total likes are: ", totalLikes)

    return totalLikes
}

const favoriteBlog = (blogs) => {
    let favorite = null

    blogs.forEach((blog) => {
        console.log("blog is: ", blog)

        if (favorite === null) {
            favorite = blog
        }
        else if (favorite.likes < blog.likes)
            favorite = blog;
        }
    )

    return favorite
}

module.exports = {
    dummy,
    calculateTotalLikes,
    favoriteBlog
}