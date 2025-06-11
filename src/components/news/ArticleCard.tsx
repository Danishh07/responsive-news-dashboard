import { Article } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FaNewspaper, FaBook } from "react-icons/fa";
import Image from "next/image";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const {
    title,
    description,
    author,
    publishedAt,
    urlToImage,
    url,
    type
  } = article;
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  const truncate = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const articleTypeIcon = type === "news" ? (
    <FaNewspaper className="h-4 w-4 text-blue-500" />
  ) : (
    <FaBook className="h-4 w-4 text-green-500" />
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image section */}      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {urlToImage ? (
          <Image
            src={urlToImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Handle image loading errors
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {articleTypeIcon}
            <span className="ml-1 capitalize">{type}</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(publishedAt)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {truncate(title, 60)}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {truncate(description || "No description available", 100)}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            By {author || "Unknown"}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  );
}
