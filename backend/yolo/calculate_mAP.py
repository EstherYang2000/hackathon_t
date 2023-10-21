import torch
from collections import Counter
import os
from pathlib import Path
import numpy as np
import pandas as pd



def parse_pred(pred_path: str, keyword = '',  date = ''):
    preds = list(filter(lambda x:(keyword in x) and (date in x) and ('.txt' in x), os.listdir(pred_path)))
    file_dict = []
    result = [] # [train_idx, class_prediction, prob_score, x1, y1, x2, y2]
    for p in preds:
        # print(os.path.basename(p))        
        with open(os.path.join(pred_path, p), 'r') as fp:
            for l in fp.read().split('\n'):
                if(len(l) > 0):
                    splitted = l.split(' ')
                    result.append([os.path.basename(p), int(splitted[0]), float(splitted[5]), float(splitted[1]), float(splitted[2]), float(splitted[3]), float(splitted[4])])
                    file_dict.append(os.path.basename(p))
                    
    print(f'Load predict result : {len(result)} files')

    return result, file_dict


def parse_ground_truth(ground_truth_path: str, keyword = '', date = ''):
    ground_truths = list(filter(lambda x:(keyword in x) and (date in x) and ('.txt' in x), os.listdir(ground_truth_path)))
    file_dict = []
    result = [] # [train_idx, class_prediction, prob_score, x1, y1, x2, y2]
    for p in ground_truths:
        with open(os.path.join(ground_truth_path, p), 'r') as fp:
            for l in fp.read().split('\n'):
                if(len(l) > 0):
                    splitted = l.split(' ')
                    result.append([os.path.basename(p), int(splitted[0]), 1, float(splitted[1]), float(splitted[2]), float(splitted[3]), float(splitted[4])])
                    file_dict.append(os.path.basename(p))
                    
    print(f'Load ground truth result : {len(result)} files')

    return result, file_dict


def intersection_over_union(boxes_preds, boxes_labels, box_format="corners"):
    """
    Calculates intersection over union

    Parameters:
        boxes_preds (tensor): Predictions of Bounding Boxes (BATCH_SIZE, 4)
        boxes_labels (tensor): Correct Labels of Boxes (BATCH_SIZE, 4)
        box_format (str): midpoint/corners, if boxes (x,y,w,h) or (x1,y1,x2,y2)

    Returns:
        tensor: Intersection over union for all examples
    """

    if box_format == "midpoint":
        box1_x1 = boxes_preds[..., 0:1] - boxes_preds[..., 2:3] / 2
        box1_y1 = boxes_preds[..., 1:2] - boxes_preds[..., 3:4] / 2
        box1_x2 = boxes_preds[..., 0:1] + boxes_preds[..., 2:3] / 2
        box1_y2 = boxes_preds[..., 1:2] + boxes_preds[..., 3:4] / 2
        box2_x1 = boxes_labels[..., 0:1] - boxes_labels[..., 2:3] / 2
        box2_y1 = boxes_labels[..., 1:2] - boxes_labels[..., 3:4] / 2
        box2_x2 = boxes_labels[..., 0:1] + boxes_labels[..., 2:3] / 2
        box2_y2 = boxes_labels[..., 1:2] + boxes_labels[..., 3:4] / 2

    elif box_format == "corners":
        box1_x1 = boxes_preds[..., 0:1]
        box1_y1 = boxes_preds[..., 1:2]
        box1_x2 = boxes_preds[..., 2:3]
        box1_y2 = boxes_preds[..., 3:4]
        box2_x1 = boxes_labels[..., 0:1]
        box2_y1 = boxes_labels[..., 1:2]
        box2_x2 = boxes_labels[..., 2:3]
        box2_y2 = boxes_labels[..., 3:4]

    x1 = torch.max(box1_x1, box2_x1)
    y1 = torch.max(box1_y1, box2_y1)
    x2 = torch.min(box1_x2, box2_x2)
    y2 = torch.min(box1_y2, box2_y2)

    intersection = (x2 - x1).clamp(0) * (y2 - y1).clamp(0)
    box1_area = abs((box1_x2 - box1_x1) * (box1_y2 - box1_y1))
    box2_area = abs((box2_x2 - box2_x1) * (box2_y2 - box2_y1))

    return intersection / (box1_area + box2_area - intersection + 1e-10)


# reference page
# https://github.com/WongKinYiu/yolov7
def compute_ap(recall, precision):
    """ Compute the average precision, given the recall and precision curves
    # Arguments
        recall:    The recall curve (list)
        precision: The precision curve (list)
        v5_metric: Assume maximum recall to be 1.0, as in YOLOv5, MMDetetion etc.
    # Returns
        Average precision, precision curve, recall curve
    """

    mrec = np.concatenate(([0.], recall, [recall[-1] + 0.01]))
    mpre = np.concatenate(([1.], precision, [0.]))

    mpre = np.flip(np.maximum.accumulate(np.flip(mpre)))

    i = np.where(mrec[1:] != mrec[:-1])[0]  # points where x axis (recall) changes
    ap = np.sum((mrec[i + 1] - mrec[i]) * mpre[i + 1])  # area under curve

    return ap, mpre, mrec


# reference page
# https://github.com/aladdinpersson/Machine-Learning-Collection/blob/master/ML/Pytorch/object_detection/metrics
def mean_average_precision(
    pred_boxes, true_boxes, iou_threshold=0.5, box_format="midpoint", num_classes=5
):
    """
    Calculates mean average precision 

    Parameters:
        pred_boxes (list): list of lists containing all bboxes with each bboxes
        specified as [train_idx, class_prediction, prob_score, x1, y1, x2, y2]
        true_boxes (list): Similar as pred_boxes except all the correct ones 
        iou_threshold (float): threshold where predicted bboxes is correct
        box_format (str): "midpoint" or "corners" used to specify bboxes
        num_classes (int): number of classes

    Returns:
        float: mAP value across all classes given a specific IoU threshold 
        list : every class AP value
    """


    average_precisions = []
    epsilon = 1e-16

    for c in range(num_classes):
        detections = []
        ground_truths = []

        for detection in pred_boxes:
            if detection[1] == c:
                detections.append(detection)

        for true_box in true_boxes:
            if (true_box[1] == c):
                ground_truths.append(true_box)

        amount_bboxes = Counter([gt[0] for gt in ground_truths])

        for key, val in amount_bboxes.items():
            amount_bboxes[key] = torch.zeros(val)

        detections.sort(key=lambda x: x[2], reverse=True)
        TP = torch.zeros((len(detections)))
        FP = torch.zeros((len(detections)))
        total_true_bboxes = len(ground_truths)

        if total_true_bboxes == 0:
            continue

        for detection_idx, detection in enumerate(detections):
            ground_truth_img = [
                bbox for bbox in ground_truths if bbox[0] == detection[0]
            ]

            num_gts = len(ground_truth_img)
            best_iou = 0

            for idx, gt in enumerate(ground_truth_img):
                iou = intersection_over_union(
                    torch.tensor(detection[3:]),
                    torch.tensor(gt[3:]),
                    box_format=box_format,
                )

                if iou > best_iou:
                    best_iou = iou
                    best_gt_idx = idx

            if best_iou > iou_threshold:
                if amount_bboxes[detection[0]][best_gt_idx] == 0:
                    TP[detection_idx] = 1
                    amount_bboxes[detection[0]][best_gt_idx] = 1
                else:
                    FP[detection_idx] = 1
            else:
                FP[detection_idx] = 1
            
        TP_cumsum = torch.cumsum(TP, dim=0)
        FP_cumsum = torch.cumsum(FP, dim=0)
        recalls = TP_cumsum / (total_true_bboxes + epsilon)
        precisions = TP_cumsum / (TP_cumsum + FP_cumsum + epsilon)
        precisions = torch.cat((torch.tensor([1]), precisions))
        recalls = torch.cat((torch.tensor([0]), recalls))
        ap, mpre, mrec = compute_ap(recalls.cpu().tolist(), precisions.cpu().tolist())
        average_precisions.append(ap)
    

    return sum(average_precisions) / len(average_precisions), average_precisions


if __name__ == "__main__":
    

    """
    Calculates daily mAP (by HQ/AZ) and total mAP

    Parameters:
        pred_path (str): path to prediction result folder
        ground_truth_path (str): path to real answer folder
        daily_map_path (str): file path to save daily mAP

    Returns:
        file: csv file of daily mAP (by HQ/AZ) 
        float : total mAP
    """

    pred_path = './path/to/pred'
    ground_truth_path = './path/to/ans'
    daily_map_path = './path/to/outputfile.csv'

    departments = ['HQ', 'AZ']
    dates = ['0911', '0912', '0913', '0914', '0915', '0918', '0919', '0920', '0921', '0922'] 
    
    

    df = pd.DataFrame(index=dates, columns=departments)
    for date in dates:
        column = {date: {date}}
        for depart in departments:
        
            true_boxes, true_file_dict = parse_ground_truth(ground_truth_path, depart, date)
            ppred_bboxes, pred_file_dict = parse_pred(pred_path, depart, date)

            m_ap, ap_lst = mean_average_precision(ppred_bboxes, true_boxes, iou_threshold = 0.5, num_classes = 5)
            df.loc[date, depart] = m_ap

            
    true_boxes, true_file_dict = parse_ground_truth(ground_truth_path)
    ppred_bboxes, pred_file_dict = parse_pred(pred_path)
    total_m_ap, total_ap_lst = mean_average_precision(ppred_bboxes, true_boxes, iou_threshold = 0.5, num_classes = 5)

    #output csv --> Can use for dashboard
    #total mAP --> For grading

    os.makedirs(os.path.dirname(daily_map_path), exist_ok=True)
    df.to_csv(daily_map_path, index=False)
    print(f'Total mAP = {total_m_ap}, every category map = {total_ap_lst}')



