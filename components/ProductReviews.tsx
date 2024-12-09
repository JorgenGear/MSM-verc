import { useState } from 'react';
import { StyleSheet, Pressable, TextInput, ActivityIndicator, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './ui/IconSymbol';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
};

type Props = {
  reviews: Review[];
  averageRating: number;
  ratingCounts: number[];
  onAddReview: (rating: number, comment: string) => Promise<void>;
};

export function ProductReviews({ reviews, averageRating, ratingCounts, onAddReview }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmitReview = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      setLoading(true);
      await onAddReview(rating, comment);
      setShowReviewForm(false);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number, size = 16, interactive = false) => (
    <ThemedView style={styles.starsContainer}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isHovered = interactive && hoveredStar !== null && i <= hoveredStar;
        const isFilled = i < count || isHovered;
        
        return (
          <Pressable
            key={i}
            onPress={() => interactive && setRating(i + 1)}
            onPressIn={() => interactive && setHoveredStar(i)}
            onPressOut={() => interactive && setHoveredStar(null)}
            style={({ pressed }) => [
              styles.star,
              { opacity: pressed && interactive ? 0.7 : 1 },
            ]}
          >
            <IconSymbol
              name={isFilled ? 'star.fill' : 'star'}
              size={size}
              color={colors.ratingStars}
            />
          </Pressable>
        );
      })}
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Rating Overview */}
      <ThemedView style={[styles.overviewCard, { backgroundColor: colors.cardBackground }]}>
        <ThemedView style={styles.ratingOverview}>
          <ThemedText style={styles.averageRating}>{averageRating.toFixed(1)}</ThemedText>
          {renderStars(averageRating)}
          <ThemedText style={[styles.totalReviews, { color: colors.textSecondary }]}>
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.ratingBars}>
          {ratingCounts
            .map((count, index) => ({
              stars: 5 - index,
              count,
              percentage: (count / reviews.length) * 100 || 0,
            }))
            .reverse()
            .map(({ stars, count, percentage }) => (
              <ThemedView key={stars} style={styles.ratingBar}>
                <ThemedText style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                  {stars}
                </ThemedText>
                <ThemedView 
                  style={[styles.barContainer, { backgroundColor: colors.lightGray }]}
                >
                  <ThemedView
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: colors.ratingStars,
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                </ThemedView>
                <ThemedText style={[styles.ratingCount, { color: colors.textSecondary }]}>
                  {count}
                </ThemedText>
              </ThemedView>
            ))}
        </ThemedView>
      </ThemedView>

      {/* Write Review Button */}
      <Pressable
        style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowReviewForm(true)}
      >
        <IconSymbol name="pencil" size={20} color="#ffffff" />
        <ThemedText style={styles.writeReviewText}>Write a Review</ThemedText>
      </Pressable>

      {/* Review Form */}
      {showReviewForm && (
        <ThemedView style={[styles.reviewForm, { backgroundColor: colors.cardBackground }]}>
          <ThemedText style={styles.formLabel}>Your Rating</ThemedText>
          {renderStars(rating, 24, true)}

          <ThemedText style={styles.formLabel}>Your Review</ThemedText>
          <TextInput
            style={[
              styles.reviewInput, 
              { 
                backgroundColor: colors.background,
                color: colors.text,
              }
            ]}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your thoughts about this product..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <ThemedView style={styles.formButtons}>
            <Pressable
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => setShowReviewForm(false)}
            >
              <ThemedText style={{ color: colors.text }}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.submitButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: loading || !comment.trim() ? 0.7 : 1 
                },
              ]}
              onPress={handleSubmitReview}
              disabled={loading || !comment.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>Submit Review</ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </ThemedView>
      )}

      {/* Reviews List */}
      <ThemedView style={styles.reviewsList}>
        {reviews.map((review) => (
          <ThemedView
            key={review.id}
            style={[styles.reviewCard, { backgroundColor: colors.cardBackground }]}
          >
            <ThemedView style={styles.reviewHeader}>
              <ThemedView style={styles.reviewerInfo}>
                <ThemedText style={styles.reviewerName}>{review.user.full_name}</ThemedText>
                <ThemedText style={[styles.reviewDate, { color: colors.textSecondary }]}>
                  {new Date(review.created_at).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
              {renderStars(review.rating)}
            </ThemedView>
            <ThemedText style={[styles.reviewComment, { color: colors.text }]}>
              {review.comment}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  overviewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  totalReviews: {
    marginTop: 8,
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    padding: 4,
  },
  ratingBars: {
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    width: 20,
    textAlign: 'right',
    fontSize: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    fontSize: 12,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  writeReviewText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewForm: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
    marginRight: 16,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
  },
});